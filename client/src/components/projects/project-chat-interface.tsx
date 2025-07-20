"use client";

import { useState, useRef, useEffect } from "react";
import { ProjectWithOrganization } from "@/server/services/project";
import { QuickAction, ChatMessage as ChatMessageType } from "@/types/chat";
import { AnimatePresence } from "motion/react";
import ChatMessageComponent from "./chat/chat-message";
import ChatInput from "./chat/chat-input";
import EmptyState from "./chat/empty-state";
import LoadingMessage from "./chat/loading-message";
import {
  MessageSquare,
  FileText,
  TrendingUp,
  Activity,
  Users,
  Clock,
  Bot,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
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
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useVellum, setUseVellum] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // Add user message
    const newUserMessage: ChatMessageType = {
      id: Date.now(),
      content: userMessage,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    try {
      // Call the chat API with conversation history
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          message: userMessage,
          conversationHistory: updatedMessages.slice(-10), // Send last 10 messages for context
          useVellum: useVellum, // Include the AI provider preference
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: ChatMessageType = {
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
      const errorMessage: ChatMessageType = {
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

  return (
    <div className="flex h-full flex-col">
      {/* AI Provider Toggle */}
      <div className="border-border/40 border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">AI Provider</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${!useVellum ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Google Gemini
              </span>
              <button
                onClick={() => setUseVellum(!useVellum)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useVellum ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useVellum ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${useVellum ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Vellum AI
              </span>
            </div>
            <Badge
              variant={useVellum ? "default" : "secondary"}
              className="gap-1"
            >
              {useVellum ? (
                <>
                  <Sparkles className="h-3 w-3" />
                  Vellum
                </>
              ) : (
                <>
                  <Bot className="h-3 w-3" />
                  Gemini
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <EmptyState
            projectName={project.name}
            quickActions={quickActions}
            onQuickActionClick={handleQuickAction}
          />
        ) : (
          <div className="space-y-4 overflow-y-auto pb-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessageComponent
                  key={msg.id}
                  message={msg}
                  projectId={project.id}
                />
              ))}
            </AnimatePresence>

            {isLoading && <LoadingMessage />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        message={message}
        isLoading={isLoading}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
