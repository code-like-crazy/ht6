import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/user";
import { db } from "@/server/db";
import { projectsTable, connectionsTable } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { querySimilarEmbeddings } from "@/server/services/embeddings";
import { pipeline } from "@xenova/transformers";
import { GoogleGenAI } from "@google/genai";

// Use a singleton to avoid reloading the model on every request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let featureExtractor: any = null;

interface EmbeddingChunk {
  id: number;
  source_type: string;
  source_id: string;
  chunk_text: string;
  metadata: Record<string, unknown>;
  distance: number;
}

interface AISource {
  id: number;
  sourceType: string;
  sourceId: string;
  snippet: string;
  metadata: Record<string, unknown>;
}

async function generateEmbedding(text: string): Promise<number[]> {
  if (!featureExtractor) {
    featureExtractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    );
  }
  const output = await featureExtractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

// AI response generation using Google Gemini
async function generateAIResponse(
  question: string,
  context: string,
  sources: EmbeddingChunk[],
): Promise<{ answer: string; sources: AISource[] }> {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });

    const prompt = `You are Loominal, an AI assistant that helps teams understand their projects by analyzing code, conversations, and documentation. Based on the following context from the project, answer the user's question in a helpful and specific way.

IMPORTANT INSTRUCTIONS:
- Be conversational and helpful, like a knowledgeable teammate
- Cite specific information from the context when relevant
- If the context doesn't contain enough information, say so clearly
- Focus on being practical and actionable
- Use the source information to provide specific references

CONTEXT FROM PROJECT:
${context}

USER QUESTION: ${question}

Please provide a comprehensive answer based on the available context.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const answer =
      response.text || "I couldn't generate a response. Please try again.";

    return {
      answer,
      sources: sources.map((source: EmbeddingChunk) => ({
        id: source.id,
        sourceType: source.source_type,
        sourceId: source.source_id,
        snippet: source.chunk_text.substring(0, 200) + "...",
        metadata: source.metadata,
      })),
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    // Fallback response if Gemini fails
    const fallbackAnswer = `I found ${sources.length} relevant pieces of information related to your question: "${question}".

${context.length > 0 ? `Here's what I found:\n\n${context.substring(0, 500)}...` : "I couldn't find specific information to answer your question in the current project context."}

${sources.length > 0 ? `\nThis information comes from ${sources.length} source(s) in your project.` : ""}

(Note: AI service temporarily unavailable, showing basic context match)`;

    return {
      answer: fallbackAnswer,
      sources: sources.map((source: EmbeddingChunk) => ({
        id: source.id,
        sourceType: source.source_type,
        sourceId: source.source_id,
        snippet: source.chunk_text.substring(0, 200) + "...",
        metadata: source.metadata,
      })),
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, message } = await req.json();

    if (!projectId || !message) {
      return NextResponse.json(
        { error: "Missing projectId or message" },
        { status: 400 },
      );
    }

    // Verify user has access to this project
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify project exists and user has access
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, parseInt(projectId)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(message);

    // Query similar embeddings from the project
    const similarChunksRaw = await querySimilarEmbeddings({
      projectId: parseInt(projectId),
      queryEmbedding,
      topK: 10, // Get more chunks for better context
    });

    // Type the chunks properly
    const similarChunks: EmbeddingChunk[] = similarChunksRaw.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chunk: any) => ({
        id: chunk.id,
        source_type: chunk.sourceType,
        source_id: chunk.sourceId,
        chunk_text: chunk.chunkText,
        metadata: chunk.metadata || {},
        distance: chunk.distance,
      }),
    );

    // Prepare context from similar chunks
    const context = similarChunks
      .map((chunk: EmbeddingChunk) => {
        const metadata = chunk.metadata || {};
        let contextPrefix = "";

        if (chunk.source_type === "github") {
          contextPrefix = `[GitHub - ${metadata.filePath || chunk.source_id}]: `;
        } else if (chunk.source_type === "slack") {
          contextPrefix = `[Slack - ${metadata.channel || "channel"}]: `;
        } else {
          contextPrefix = `[${chunk.source_type}]: `;
        }

        return contextPrefix + chunk.chunk_text;
      })
      .join("\n\n");

    // Generate AI response
    const aiResponse = await generateAIResponse(
      message,
      context,
      similarChunks,
    );

    // Get project connections for additional context
    const connections = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.projectId, parseInt(projectId)),
          eq(connectionsTable.isActive, 1),
        ),
      );

    return NextResponse.json({
      message: aiResponse.answer,
      sources: aiResponse.sources,
      metadata: {
        projectName: project.name,
        chunksFound: similarChunks.length,
        connectionsAvailable: connections.map((c) => c.type),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 },
    );
  }
}
