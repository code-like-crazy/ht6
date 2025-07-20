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
    const chunksBySourceType = similarChunksRaw.reduce(
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

    // Generate AI response using the new modular function
    const aiResponse = await generateAIResponse(message, similarChunks);

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
