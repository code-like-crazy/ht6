import { db } from "../db";
import { embeddingsTable } from "../db/schema";
import { sql } from "drizzle-orm";

// Type for inserting a new embedding
export interface InsertEmbeddingInput {
  projectId: number;
  sourceType: string; // e.g., "github", "slack"
  sourceId: string; // e.g., file path, message id
  chunkText: string;
  embedding: number[]; // Must match vector dimension (e.g., 1536)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

// Insert a new embedding row
export async function insertEmbedding(input: InsertEmbeddingInput) {
  await db.insert(embeddingsTable).values({
    projectId: input.projectId,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    chunkText: input.chunkText,
    embedding: input.embedding,
    metadata: input.metadata ?? {},
  });
}

// Query top-N most similar embeddings for a given project and query embedding
export async function querySimilarEmbeddings({
  projectId,
  queryEmbedding,
  topK = 5,
}: {
  projectId: number;
  queryEmbedding: number[];
  topK?: number;
}) {
  // DrizzleORM doesn't natively support vector ops, so use raw SQL
  const result = await db.execute(
    sql`
      SELECT
        id, source_type, source_id, chunk_text, embedding, metadata, created_at, updated_at,
        (embedding <-> ${queryEmbedding}) AS distance
      FROM embeddings
      WHERE project_id = ${projectId}
      ORDER BY distance ASC
      LIMIT ${topK}
    `,
  );
  return result.rows;
}
