/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from "@google/genai";
import {
  buildPrompt,
  buildFallbackResponse,
  ContextFormatters,
} from "@/config/prompts";
import {
  EMBEDDING_CONFIG,
  SLACK_LOW_QUALITY_PATTERNS,
} from "@/config/embeddings";

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

interface AIResponse {
  answer: string;
  sources: AISource[];
}

/**
 * Generates an AI response using Google Gemini with improved prompting
 */
export async function generateAIResponse(
  question: string,
  chunks: EmbeddingChunk[],
  conversationHistory?: { content: string; sender: string }[],
): Promise<AIResponse> {
  try {
    // Format context using the new context formatters
    const formattedChunks = chunks.map((chunk) =>
      ContextFormatters.formatChunk(chunk),
    );
    const context = ContextFormatters.combineChunks(formattedChunks);

    // Build the complete prompt with conversation history
    const prompt = buildPrompt(question, context, conversationHistory);

    // Initialize Google AI
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });

    // Generate response
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const answer =
      response.text || "I couldn't generate a response. Please try again.";

    // Transform chunks to sources
    const sources: AISource[] = chunks.map((chunk: EmbeddingChunk) => ({
      id: chunk.id,
      sourceType: chunk.source_type,
      sourceId: chunk.source_id,
      snippet: chunk.chunk_text.substring(0, 200) + "...",
      metadata: chunk.metadata,
    }));

    return {
      answer,
      sources,
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    // Generate fallback response using the new template
    const context = chunks
      .map((chunk) => ContextFormatters.formatChunk(chunk))
      .join("\n\n");

    const fallbackAnswer = buildFallbackResponse(
      question,
      context,
      chunks.length,
    );

    return {
      answer: fallbackAnswer,
      sources: chunks.map((chunk: EmbeddingChunk) => ({
        id: chunk.id,
        sourceType: chunk.source_type,
        sourceId: chunk.source_id,
        snippet: chunk.chunk_text.substring(0, 200) + "...",
        metadata: chunk.metadata,
      })),
    };
  }
}

/**
 * Filters out low-quality chunks that don't provide meaningful context
 */
export function filterLowQualityChunks(chunks: any[]): any[] {
  return chunks.filter((chunk: any) => {
    const chunkText = chunk.chunkText as string;

    // Filter out Slack system messages
    if (chunk.sourceType === "slack") {
      // Check if the chunk text matches any low-quality patterns
      if (
        SLACK_LOW_QUALITY_PATTERNS.some((pattern) => pattern.test(chunkText))
      ) {
        return false;
      }

      // Filter out very short messages (likely not useful)
      if (chunkText.trim().length < EMBEDDING_CONFIG.minSlackMessageLength) {
        return false;
      }
    }

    // Filter out very short chunks from any source
    if (chunkText.trim().length < EMBEDDING_CONFIG.minChunkLength) {
      return false;
    }

    return true;
  });
}

/**
 * Ensures diversity across source types in the selected chunks
 */
export function ensureSourceDiversity(
  chunks: any[],
  maxPerSourceType: number = EMBEDDING_CONFIG.maxChunksPerSourceType,
): any[] {
  // Group chunks by source type
  const chunksBySourceType = chunks.reduce(
    (acc, chunk: any) => {
      const sourceType = chunk.sourceType as string;
      if (!acc[sourceType]) {
        acc[sourceType] = [];
      }
      acc[sourceType].push(chunk);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Select top chunks from each source type to ensure diversity
  const diverseChunks: any[] = [];
  const sourceTypes = Object.keys(chunksBySourceType);

  // Prioritize getting at least one chunk from each source type
  sourceTypes.forEach((sourceType) => {
    const chunks = chunksBySourceType[sourceType];
    const chunksToAdd = Math.min(chunks.length, maxPerSourceType);
    diverseChunks.push(...chunks.slice(0, chunksToAdd));
  });

  // If we have fewer than the target number of chunks, fill up with the best remaining ones
  if (diverseChunks.length < EMBEDDING_CONFIG.maxChunksToProcess) {
    const usedChunkIds = new Set(diverseChunks.map((chunk) => chunk.id));
    const remainingChunks = chunks.filter(
      (chunk) => !usedChunkIds.has(chunk.id),
    );
    const additionalChunks = remainingChunks.slice(
      0,
      EMBEDDING_CONFIG.maxChunksToProcess - diverseChunks.length,
    );
    diverseChunks.push(...additionalChunks);
  }

  // Sort by distance to maintain relevance order
  diverseChunks.sort(
    (a: any, b: any) => (a.distance as number) - (b.distance as number),
  );

  return diverseChunks;
}
