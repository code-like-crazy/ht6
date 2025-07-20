/* eslint-disable @typescript-eslint/no-explicit-any */
import { VellumClient } from "vellum-ai";
import { buildFallbackResponse, ContextFormatters } from "@/config/prompts";

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
  provider: string;
}

/**
 * Simple Vellum AI integration that uses a basic chat completion
 * This is a fallback approach if prompt deployments are too complex to set up
 */
export async function generateSimpleVellumResponse(
  question: string,
  chunks: EmbeddingChunk[],
  conversationHistory?: { content: string; sender: string }[],
): Promise<AIResponse> {
  try {
    // Check if Vellum API key is configured
    if (!process.env.VELLUM_API_KEY) {
      throw new Error("VELLUM_API_KEY environment variable is not set");
    }

    // Initialize Vellum client
    const vellum = new VellumClient({
      apiKey: process.env.VELLUM_API_KEY,
    });

    // Format context using the existing context formatters
    const formattedChunks = chunks.map((chunk) =>
      ContextFormatters.formatChunk(chunk),
    );
    const context = ContextFormatters.combineChunks(formattedChunks);

    // Build conversation history string
    const conversationHistoryString = conversationHistory
      ? conversationHistory
          .slice(-10)
          .map((msg) => `${msg.sender}: ${msg.content}`)
          .join("\n")
      : "";

    // Create a simple prompt without requiring deployment setup
    const systemPrompt = `You are Loominal, an AI-powered knowledge engine that helps teams with onboarding and knowledge transfer. You have access to project context from GitHub repositories, Slack conversations, Linear tickets, and other integrated tools.

Your goal is to provide helpful, accurate answers based on the available context. Always cite your sources when possible and be specific about where information comes from.

Available Context:
${context}

Conversation History:
${conversationHistoryString}

Sources Found: ${chunks.length}

Instructions:
- Provide clear, actionable answers
- Cite specific sources when referencing information
- If you're unsure about something, say so
- Focus on helping with onboarding and knowledge transfer
- Be conversational but professional`;

    // Try to use a simple chat completion if available
    // Note: This is a simplified approach - you might need to adjust based on Vellum's actual API
    const response = await fetch("https://api.vellum.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VELLUM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4", // or whatever model you have access to in Vellum
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Vellum API error: ${response.status}`);
    }

    const data = await response.json();
    const answer =
      data.choices?.[0]?.message?.content ||
      "I couldn't generate a response using Vellum AI.";

    // Transform chunks to sources
    const sources: AISource[] = chunks.map((chunk: EmbeddingChunk) => ({
      id: chunk.id,
      sourceType: chunk.source_type,
      sourceId: chunk.source_id,
      snippet: chunk.chunk_text.substring(0, 200) + "...",
      metadata: chunk.metadata,
    }));

    return {
      answer: `${answer}\n\n*Powered by Vellum AI*`,
      sources,
      provider: "vellum-simple",
    };
  } catch (error) {
    console.error("Simple Vellum AI error:", error);

    // Generate fallback response using the existing template
    const context = chunks
      .map((chunk) => ContextFormatters.formatChunk(chunk))
      .join("\n\n");

    const fallbackAnswer = buildFallbackResponse(
      question,
      context,
      chunks.length,
    );

    return {
      answer: `${fallbackAnswer}\n\n*Note: This response was generated using fallback logic due to a Vellum AI service error.*`,
      sources: chunks.map((chunk: EmbeddingChunk) => ({
        id: chunk.id,
        sourceType: chunk.source_type,
        sourceId: chunk.source_id,
        snippet: chunk.chunk_text.substring(0, 200) + "...",
        metadata: chunk.metadata,
      })),
      provider: "fallback",
    };
  }
}
