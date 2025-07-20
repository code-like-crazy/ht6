/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { querySimilarEmbeddings } from "@/server/services/embeddings";

import { pipeline } from "@xenova/transformers";

// Use a singleton to avoid reloading the model on every request
let featureExtractor: any = null;

async function generateEmbedding(text: string): Promise<number[]> {
  if (!featureExtractor) {
    featureExtractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    );
  }
  // The output is [1, 384] for this model; flatten to 1D array
  const output = await featureExtractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, question, topK = 5 } = await req.json();

    if (!projectId || !question) {
      return NextResponse.json(
        { error: "Missing projectId or question" },
        { status: 400 },
      );
    }

    // Generate embedding for the user question
    const queryEmbedding = await generateEmbedding(question);

    // Query the most similar chunks for this project
    const results = await querySimilarEmbeddings({
      projectId,
      queryEmbedding,
      topK,
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
