"use client";

import { useState } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Send,
  Sparkles,
  Clock,
  TrendingUp,
  FileText,
  Users,
  Activity,
  Loader2,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface AISource {
  id: number;
  sourceType: string;
  sourceId: string;
  snippet: string;
  metadata: Record<string, unknown>;
}

interface Message {
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
}

interface ProjectChatInterfaceProps {
  project: ProjectWithOrganization;
  user: User;
}

export default function ProjectChatInterface({
  project,
  user,
}: ProjectChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    {
      label: "Describe this project to me",
      icon: FileText,
      prompt: "Can you give me a comprehensive overview of this project?",
    },
    {
      label: "What was the progress this week?",
      icon: TrendingUp,
      prompt: "What progress has been made on this project in the past week?",
    },
    {
      label: "Show recent team activity",
      icon: Activity,
      prompt: "What has the team been working on recently?",
    },
    {
      label: "Who are the key contributors?",
      icon: Users,
      prompt: "Who are the main contributors and what are their roles?",
    },
    {
      label: "What are the current blockers?",
      icon: Clock,
      prompt:
        "What are the current blockers or challenges facing this project?",
    },
    {
      label: "Summarize recent discussions",
      icon: MessageSquare,
      prompt:
        "Can you summarize the most important recent discussions about this project?",
    },
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      content: userMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Call the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: data.message,
        sender: "assistant",
        timestamp: new Date(),
        sources: data.sources,
        metadata: data.metadata,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        content:
          "Sorry, I encountered an error while processing your question. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      {/* <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {project.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Ask questions about your project and get instant answers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Sparkles className="text-primary h-5 w-5" />
          </div>
        </div>
      </div> */}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          /* Empty State with Quick Actions */
          <div className="flex h-full flex-col items-center justify-center space-y-8">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <MessageSquare className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Start a conversation
              </h3>
              <p className="text-muted-foreground max-w-md">
                Ask me anything about {project.name}. I have access to all your
                project data, conversations, and documentation.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="group border-border from-card/40 to-card/20 hover:from-card/60 hover:to-card/40 hover:border-primary/20 cursor-pointer bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="from-primary/15 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-300 group-hover:scale-110">
                        <action.icon className="text-primary h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground group-hover:text-primary text-sm leading-relaxed font-semibold transition-colors duration-300">
                          {action.label}
                        </p>
                        <div className="from-primary to-primary/50 mt-2 h-0.5 w-0 bg-gradient-to-r transition-all duration-300 group-hover:w-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="space-y-4 overflow-y-auto pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium opacity-70">Sources:</p>
                      {msg.sources.map((source, index) => (
                        <div
                          key={source.id}
                          className="bg-background/50 rounded border p-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {source.sourceType === "github" ? "📁" : "💬"}{" "}
                              {source.sourceType}
                            </span>
                            <span className="opacity-70">
                              {source.sourceId}
                            </span>
                          </div>
                          <p className="mt-1 opacity-80">{source.snippet}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.metadata && (
                    <div className="mt-2 text-xs opacity-50">
                      Found {msg.metadata.chunksFound} relevant chunks from{" "}
                      {msg.metadata.connectionsAvailable.join(", ")}
                    </div>
                  )}
                  <p className="mt-1 text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted max-w-[80%] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-border/50 bg-card/30 mt-6 rounded-lg border p-4">
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your project..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
