/* eslint-disable @typescript-eslint/no-explicit-any */
import { insertEmbedding, InsertEmbeddingInput } from "./embeddings";
import { pipeline } from "@xenova/transformers";

// Use a singleton to avoid reloading the model
let featureExtractor: any = null;

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

export interface ChunkInput {
  projectId: number;
  sourceType: string;
  sourceId: string;
  chunkText: string;
  metadata?: Record<string, any>;
}

// Batch insert embeddings for an array of chunks
export async function batchInsertEmbeddings(chunks: ChunkInput[]) {
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.chunkText);
    const input: InsertEmbeddingInput = {
      projectId: chunk.projectId,
      sourceType: chunk.sourceType,
      sourceId: chunk.sourceId,
      chunkText: chunk.chunkText,
      embedding,
      metadata: chunk.metadata,
    };
    await insertEmbedding(input);
  }
}
