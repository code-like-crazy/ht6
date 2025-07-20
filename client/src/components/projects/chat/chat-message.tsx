"use client";

import React from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink, FileText } from "lucide-react";
import { AISource } from "@/types/chat";

interface ChatMessageProps {
  message: {
    id: number;
    content: string;
    sender: "user" | "assistant";
    timestamp: Date;
    sources?: AISource[];
    metadata?: {
      projectName: string;
      chunksFound: number;
      connectionsAvailable: string[];
      timestamp: string;
    };
  };
  projectId?: number;
}

const getSourceIcon = (sourceType: string) => {
  switch (sourceType) {
    case "github":
      return "📁";
    case "slack":
      return "💬";
    case "linear":
      return "📋";
    case "notion":
      return "📝";
    case "figma":
      return "🎨";
    default:
      return "📄";
  }
};

const generateGitHubUrl = (source: AISource) => {
  const metadata = source.metadata || {};

  if (source.sourceType !== "github") {
    return null;
  }

  // Extract repository information from metadata
  const repoOwner = metadata.repoOwner as string;
  const repoName = metadata.repoName as string;
  const filePath = metadata.filePath as string;
  const commitHash = (metadata.commitHash as string) || "main";
  const lineStart = metadata.lineStart as number;
  const lineEnd = metadata.lineEnd as number;

  // If we don't have the essential info, try to parse from sourceId
  if (!repoOwner || !repoName || !filePath) {
    // sourceId might be in format "owner/repo" or just "repo"
    const sourceIdParts = source.sourceId.split("/");
    if (sourceIdParts.length >= 2) {
      const owner = sourceIdParts[0];
      const repo = sourceIdParts[1];
      const path = filePath || (metadata.path as string) || "";

      if (owner && repo && path) {
        let url = `https://github.com/${owner}/${repo}/blob/${commitHash}/${path}`;

        // Add line numbers if available
        if (lineStart && lineEnd) {
          url += `#L${lineStart}-L${lineEnd}`;
        } else if (lineStart) {
          url += `#L${lineStart}`;
        }

        return url;
      }
    }
    return null;
  }

  // Build the URL with proper structure
  let url = `https://github.com/${repoOwner}/${repoName}/blob/${commitHash}/${filePath}`;

  // Add line numbers if available
  if (lineStart && lineEnd) {
    url += `#L${lineStart}-L${lineEnd}`;
  } else if (lineStart) {
    url += `#L${lineStart}`;
  }

  return url;
};

const formatSourceTitle = (source: AISource) => {
  const metadata = source.metadata || {};

  if (source.sourceType === "github") {
    const filePath = (metadata.filePath as string) || source.sourceId;
    const fileName =
      filePath.toString().split("/").pop() || filePath.toString();
    return fileName;
  }

  if (source.sourceType === "slack") {
    const channel = (metadata.channel as string) || "channel";
    const threadTs = metadata.threadTs as string | undefined;
    return threadTs ? `${channel} (thread)` : channel;
  }

  return source.sourceId;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          message.sender === "user"
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    className="my-4 rounded-md text-sm"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-muted/50 rounded px-1 py-0.5 text-sm">
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => (
                <h1 className="mt-6 mb-4 text-lg font-bold first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-5 mb-3 text-base font-semibold first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-4 mb-2 text-sm font-semibold first:mt-0">
                  {children}
                </h3>
              ),
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="mb-4 list-inside list-disc space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 list-inside list-decimal space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-primary/30 my-4 border-l-4 pl-4 italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sources" className="border-none">
                <AccordionTrigger className="px-0 py-3 hover:no-underline">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">
                      {message.sources.length} Source
                      {message.sources.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="space-y-3 pt-2">
                    {message.sources.map((source, index) => {
                      const githubUrl = generateGitHubUrl(source);
                      const sourceTitle = formatSourceTitle(source);

                      return (
                        <motion.div
                          key={source.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <Card className="border-border/50 bg-background/30 hover:bg-background/50 transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="text-muted-foreground mt-0.5 text-lg">
                                    {getSourceIcon(source.sourceType)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex items-center gap-2">
                                      <span className="text-foreground text-sm font-medium">
                                        {sourceTitle}
                                      </span>
                                      {githubUrl && (
                                        <a
                                          href={githubUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      )}
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                      {source.snippet}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {message.metadata && (
          <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
            <span>{message.metadata.chunksFound} sources analyzed</span>
            <span>•</span>
            <span>
              {new Date(message.metadata.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
