/**
 * Prompt Configuration for Loominal AI Assistant
 *
 * This file contains all prompts and prompt-related configuration for the AI assistant.
 * Prompts are modular and can be easily modified without touching the main API logic.
 */

export interface PromptConfig {
  systemPrompt: string;
  instructions: string[];
  responseFormat: string;
  contextTemplate: string;
  fallbackTemplate: string;
}

export const LOOMINAL_PROMPTS: PromptConfig = {
  systemPrompt: `You are Loominal, an AI-powered knowledge engine that helps teams understand their projects by analyzing code, conversations, and documentation from GitHub, Linear, Slack, Figma, and Notion.

Your core mission is to transform scattered project context into instant, cited answers that accelerate team onboarding and knowledge transfer.`,

  instructions: [
    "Be conversational and helpful, like a knowledgeable teammate who has deep context about the project",
    "Always respond in well-formatted Markdown to take advantage of our rich text interface",
    "Cite specific information from the provided context when relevant, using inline references",
    "If the context doesn't contain enough information to fully answer the question, clearly state what's missing and suggest where the user might find more information",
    "Focus on being practical and actionable - provide specific next steps when possible",
    "Use the source information to provide specific references that users can click through to",
    "Structure your responses with clear headings, bullet points, and code blocks when appropriate",
    "When discussing code, use proper syntax highlighting with language-specific code blocks",
    "For complex topics, break down your response into digestible sections",
    "Always maintain a helpful, professional tone while being approachable and easy to understand",
  ],

  responseFormat: `Format your response in Markdown with:
- **Clear headings** for different sections
- **Bullet points** for lists and key information
- **Code blocks** with proper language syntax highlighting
- **Inline code** for variable names, file paths, and short code snippets
- **Bold text** for emphasis on important points
- **Links** to external resources when helpful
- **Blockquotes** for important notes or warnings`,

  contextTemplate: `## Context from Project Sources

The following information has been gathered from various sources in the project to help answer your question:

{context}

---`,

  fallbackTemplate: `I found {sourceCount} relevant pieces of information related to your question: "{question}".

{contextSummary}

{sourcesInfo}

*Note: AI service temporarily unavailable, showing basic context match*`,
};

/**
 * Builds the complete prompt for the AI assistant
 */
export function buildPrompt(
  question: string,
  context: string,
  conversationHistory?: { content: string; sender: string }[],
): string {
  const { systemPrompt, instructions, responseFormat, contextTemplate } =
    LOOMINAL_PROMPTS;

  const formattedContext = contextTemplate.replace("{context}", context);

  // Format conversation history if provided
  let conversationSection = "";
  if (conversationHistory && conversationHistory.length > 1) {
    const recentHistory = conversationHistory.slice(-6); // Last 6 messages for context
    conversationSection = `
## Recent Conversation
${recentHistory
  .map(
    (msg) =>
      `**${msg.sender === "user" ? "User" : "Assistant"}**: ${msg.content}`,
  )
  .join("\n\n")}

---
`;
  }

  return `${systemPrompt}

## Instructions
${instructions.map((instruction) => `- ${instruction}`).join("\n")}

## Response Format
${responseFormat}

${conversationSection}${formattedContext}

## Current User Question
${question}

Please provide a comprehensive answer based on the available context and conversation history, formatted in Markdown.`;
}

/**
 * Builds a fallback response when the AI service is unavailable
 */
export function buildFallbackResponse(
  question: string,
  context: string,
  sourceCount: number,
): string {
  const { fallbackTemplate } = LOOMINAL_PROMPTS;

  const contextSummary =
    context.length > 0
      ? `Here's what I found:\n\n${context.substring(0, 500)}...`
      : "I couldn't find specific information to answer your question in the current project context.";

  const sourcesInfo =
    sourceCount > 0
      ? `\nThis information comes from **${sourceCount} source(s)** in your project.`
      : "";

  return fallbackTemplate
    .replace("{question}", question)
    .replace("{sourceCount}", sourceCount.toString())
    .replace("{contextSummary}", contextSummary)
    .replace("{sourcesInfo}", sourcesInfo);
}

/**
 * Context formatting utilities
 */
export const ContextFormatters = {
  /**
   * Formats a context chunk with proper source attribution
   */
  formatChunk: (chunk: {
    source_type: string;
    source_id: string;
    chunk_text: string;
    metadata: Record<string, unknown>;
  }): string => {
    const metadata = chunk.metadata || {};
    let contextPrefix = "";

    switch (chunk.source_type) {
      case "github":
        const filePath = (metadata.filePath as string) || chunk.source_id;
        const fileName = filePath.split("/").pop() || filePath;
        contextPrefix = `**GitHub - \`${fileName}\`**`;
        break;
      case "slack":
        const channel = (metadata.channel as string) || "channel";
        const threadTs = metadata.threadTs as string | undefined;
        contextPrefix = `**Slack - #${channel}${threadTs ? " (thread)" : ""}**`;
        break;
      case "linear":
        const ticketId = (metadata.ticketId as string) || chunk.source_id;
        contextPrefix = `**Linear - ${ticketId}**`;
        break;
      case "notion":
        const pageTitle = (metadata.pageTitle as string) || chunk.source_id;
        contextPrefix = `**Notion - ${pageTitle}**`;
        break;
      // TODO: Add support for Figma later
      //   case "figma":
      //     const fileName = metadata.fileName as string || chunk.source_id;
      //     contextPrefix = `**Figma - ${fileName}**`;
      //     break;
      default:
        contextPrefix = `**${chunk.source_type}**`;
    }

    return `${contextPrefix}:\n${chunk.chunk_text}`;
  },

  /**
   * Combines multiple formatted chunks into a cohesive context
   */
  combineChunks: (formattedChunks: string[]): string => {
    return formattedChunks.join("\n\n---\n\n");
  },
};
