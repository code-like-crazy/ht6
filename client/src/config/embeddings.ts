/**
 * Embedding Configuration for Loominal
 *
 * This file contains configuration for embedding generation and similarity search.
 */

export interface EmbeddingConfig {
  model: string;
  maxChunksToRetrieve: number;
  maxChunksToProcess: number;
  maxChunksPerSourceType: number;
  minChunkLength: number;
  minSlackMessageLength: number;
  similarityThreshold?: number;
}

export const EMBEDDING_CONFIG: EmbeddingConfig = {
  // Model configuration
  model: "Xenova/all-MiniLM-L6-v2",

  // Retrieval limits
  maxChunksToRetrieve: 30, // Get more chunks initially to ensure diversity
  maxChunksToProcess: 10, // Final number of chunks to send to AI
  maxChunksPerSourceType: 4, // Max chunks per source type for diversity

  // Quality filters
  minChunkLength: 10, // Minimum characters for any chunk
  minSlackMessageLength: 20, // Minimum characters for Slack messages

  // Optional similarity threshold (not currently used but available)
  similarityThreshold: 0.7,
};

/**
 * Pipeline configuration for the embedding model
 */
export const PIPELINE_CONFIG = {
  pooling: "mean",
  normalize: true,
} as const;

/**
 * Low-quality patterns for filtering Slack messages
 */
export const SLACK_LOW_QUALITY_PATTERNS = [
  /has joined the channel/i,
  /has left the channel/i,
  /set the channel topic/i,
  /pinned a message/i,
  /unpinned a message/i,
  /uploaded a file/i,
  /started a call/i,
  /ended a call/i,
  /changed the channel name/i,
  /archived this channel/i,
  /unarchived this channel/i,
  /<@U[A-Z0-9]+> has joined/i,
  /<@U[A-Z0-9]+> has left/i,
] as const;
