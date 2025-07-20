import { batchInsertEmbeddings, ChunkInput } from "./embeddings-batch";

// Simple line-based chunking (can be improved)
function chunkFileContent(
  content: string,
  filePath: string,
  projectId: number,
  sourceType = "github",
  linesPerChunk = 20,
): ChunkInput[] {
  const lines = content.split("\n");
  const chunks: ChunkInput[] = [];
  for (let i = 0; i < lines.length; i += linesPerChunk) {
    const chunkLines = lines.slice(i, i + linesPerChunk);
    const chunkText = chunkLines.join("\n");
    const chunk: ChunkInput = {
      projectId,
      sourceType,
      sourceId: `${filePath}#${i + 1}-${i + chunkLines.length}`,
      chunkText,
      metadata: {
        filePath,
        startLine: i + 1,
        endLine: i + chunkLines.length,
      },
    };
    chunks.push(chunk);
  }
  return chunks;
}

// Main function to embed all files in a repo
export async function embedGithubRepoFiles({
  projectId,
  files,
}: {
  projectId: number;
  files: { path: string; content: string }[];
}) {
  let allChunks: ChunkInput[] = [];
  for (const file of files) {
    const chunks = chunkFileContent(file.content, file.path, projectId);
    allChunks = allChunks.concat(chunks);
  }
  await batchInsertEmbeddings(allChunks);
}
