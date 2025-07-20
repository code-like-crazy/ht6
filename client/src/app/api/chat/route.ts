import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/user";
import { db } from "@/server/db";
import { projectsTable, connectionsTable } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { querySimilarEmbeddings } from "@/server/services/embeddings";
import {
  generateAIResponse,
  filterLowQualityChunks,
  ensureSourceDiversity,
} from "@/server/services/ai-response";
import { generateVellumResponse } from "@/server/services/vellum-ai";
import { EMBEDDING_CONFIG, PIPELINE_CONFIG } from "@/config/embeddings";
import { pipeline } from "@xenova/transformers";

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
      EMBEDDING_CONFIG.model,
    );
  }
  const output = await featureExtractor(text, PIPELINE_CONFIG);
  return Array.from(output.data);
}

// Helper function to determine if we need to fetch new sources
function shouldFetchNewSources(
  message: string,
  conversationHistory: { content: string; sender: string }[],
): boolean {
  const lowerMessage = message.toLowerCase();

  // Always fetch sources for the first message
  if (conversationHistory.length <= 1) {
    return true;
  }

  // Keywords that indicate need for new context
  const newContextKeywords = [
    "show me",
    "find",
    "search",
    "what is",
    "how does",
    "where is",
    "tell me about",
    "explain",
    "describe",
    "overview",
    "summary",
    "recent",
    "latest",
    "new",
    "current",
    "status",
    "progress",
  ];

  // Follow-up keywords that likely don't need new sources
  const followUpKeywords = [
    "thanks",
    "thank you",
    "ok",
    "okay",
    "yes",
    "no",
    "continue",
    "more details",
    "elaborate",
    "clarify",
    "what do you mean",
    "can you explain",
    "how so",
    "why is that",
  ];

  // Check if it's likely a follow-up question
  const isFollowUp = followUpKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );
  if (isFollowUp) {
    return false;
  }

  // Check if it's asking for new information
  const needsNewContext = newContextKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );
  if (needsNewContext) {
    return true;
  }

  // If the message is short and conversational, probably doesn't need new sources
  if (message.length < 50 && !lowerMessage.includes("?")) {
    return false;
  }

  // Default to fetching sources for substantial questions
  return message.length > 20;
}

export async function POST(req: NextRequest) {
  try {
    const {
      projectId,
      message,
      conversationHistory = [],
      useVellum = false,
    } = await req.json();

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

    // Determine if we need to fetch new sources or use conversation context
    const needsNewSources = shouldFetchNewSources(message, conversationHistory);

    let similarChunks: EmbeddingChunk[] = [];
    let chunksBySourceType: Record<string, unknown[]> = {};

    if (needsNewSources) {
      // Generate embedding for the user's question
      const queryEmbedding = await generateEmbedding(message);

      // Query similar embeddings with diversity across source types
      // First, get a larger set of similar chunks
      const allSimilarChunksRaw = await querySimilarEmbeddings({
        projectId: parseInt(projectId),
        queryEmbedding,
        topK: EMBEDDING_CONFIG.maxChunksToRetrieve,
      });

      // Filter out low-quality chunks using the new utility function
      const filteredChunks = filterLowQualityChunks(allSimilarChunksRaw);

      // Ensure diversity across source types using the new utility function
      const similarChunksRaw = ensureSourceDiversity(filteredChunks);

      // Group chunks by source type for logging
      chunksBySourceType = similarChunksRaw.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc, chunk: any) => {
          const sourceType = chunk.sourceType as string;
          if (!acc[sourceType]) {
            acc[sourceType] = [];
          }
          acc[sourceType].push(chunk);
          return acc;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<string, any[]>,
      );

      // Log source type distribution for debugging
      console.log("Source types found:", Object.keys(chunksBySourceType));
      console.log(
        "Chunks per source type:",
        Object.fromEntries(
          Object.entries(chunksBySourceType).map(([type, chunks]) => [
            type,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (chunks as any[]).length,
          ]),
        ),
      );

      // Type the chunks properly
      similarChunks = similarChunksRaw.map(
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
    } else {
      console.log("Skipping source fetch - using conversation context only");
    }

    // Generate AI response using conversation history and optionally new sources
    // Choose between Vellum AI and Google Gemini based on the useVellum parameter
    const aiResponse = useVellum
      ? await generateVellumResponse(
          message,
          similarChunks,
          conversationHistory,
        )
      : await generateAIResponse(message, similarChunks, conversationHistory);

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
        sourceTypesFound: Object.keys(chunksBySourceType),
        sourceTypeDistribution: Object.fromEntries(
          Object.entries(chunksBySourceType).map(([type, chunks]) => [
            type,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (chunks as any[]).length,
          ]),
        ),
        aiProvider: aiResponse.provider || (useVellum ? "vellum" : "gemini"),
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
