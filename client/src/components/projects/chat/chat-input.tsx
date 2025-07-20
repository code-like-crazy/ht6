"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export default function ChatInput({
  message,
  isLoading,
  onMessageChange,
  onSendMessage,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border/50 bg-card/30 mt-6 rounded-lg border p-4"
    >
      <div className="flex gap-3">
        <Input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about your project..."
          className="flex-1"
        />
        <Button
          onClick={onSendMessage}
          disabled={!message.trim() || isLoading}
          className="relative overflow-hidden"
        >
          <motion.div
            className="bg-primary/20 absolute inset-0"
            initial={{ x: "-100%" }}
            animate={{ x: isLoading ? "100%" : "-100%" }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
          />
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
    </motion.div>
  );
}
