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
 * Generates an AI response using Vellum AI Prompt Deployment
 */
export async function generateVellumResponse(
  question: string,
  chunks: EmbeddingChunk[],
  conversationHistory?: { content: string; sender: string }[],
): Promise<AIResponse> {
  try {
    // Check if Vellum API key is configured
    if (!process.env.VELLUM_API_KEY) {
      throw new Error("VELLUM_API_KEY environment variable is not set");
    }

    // Check if prompt deployment name is configured
    if (!process.env.VELLUM_PROMPT_DEPLOYMENT_NAME) {
      throw new Error(
        "VELLUM_PROMPT_DEPLOYMENT_NAME environment variable is not set",
      );
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

    // Debug logging to see what we're sending to Vellum
    console.log("=== VELLUM DEBUG INFO ===");
    console.log("Question:", question);
    console.log("Context length:", context.length);
    console.log("Context preview:", context.substring(0, 500) + "...");
    console.log("Chunks count:", chunks.length);
    console.log("Conversation history:", conversationHistoryString);
    console.log("========================");

    // Execute the prompt deployment with inputs
    const result = await vellum.executePrompt({
      promptDeploymentName: process.env.VELLUM_PROMPT_DEPLOYMENT_NAME,
      releaseTag: "LATEST",
      inputs: [
        {
          type: "STRING",
          name: "question",
          value: question,
        },
        {
          type: "STRING",
          name: "context",
          value: context,
        },
        {
          type: "STRING",
          name: "conversation_history",
          value: conversationHistoryString,
        },
        {
          type: "STRING",
          name: "source_count",
          value: chunks.length.toString(),
        },
      ],
    });

    let answer: string;

    if (result.state === "REJECTED") {
      throw new Error(result.error.message);
    } else if (result.state === "FULFILLED") {
      // Extract the answer from the first output
      const output = result.outputs[0];
      if (output?.type === "STRING") {
        answer =
          output.value || "I couldn't generate a response using Vellum AI.";
      } else {
        answer = "I couldn't generate a response using Vellum AI.";
      }
    } else {
      answer = "I couldn't generate a response using Vellum AI.";
    }

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
      provider: "vellum",
    };
  } catch (error) {
    console.error("Vellum AI error:", error);

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

/**
 * Generates an AI response using Vellum Workflows (for more complex use cases)
 * Note: This is a simplified version that falls back to prompt deployment
 */
export async function generateVellumWorkflowResponse(
  question: string,
  chunks: EmbeddingChunk[],
  workflowDeploymentId: string,
  conversationHistory?: { content: string; sender: string }[],
): Promise<AIResponse> {
  try {
    // For now, fallback to the prompt deployment approach
    // This can be expanded when workflow API types are more stable
    console.log(`Attempting to use Vellum workflow: ${workflowDeploymentId}`);

    const result = await generateVellumResponse(
      question,
      chunks,
      conversationHistory,
    );

    return {
      ...result,
      provider: "vellum-workflow-fallback",
    };
  } catch (error) {
    console.error("Vellum Workflow error:", error);

    // Fallback to regular Vellum response
    return generateVellumResponse(question, chunks, conversationHistory);
  }
}
