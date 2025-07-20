"use client";

import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function LoadingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-muted max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full"></div>
            <Loader2 className="text-primary h-4 w-4 animate-spin" />
          </div>
          <div>
            <p className="text-sm">Thinking...</p>
            <p className="text-muted-foreground text-xs">
              Analyzing your project data
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
