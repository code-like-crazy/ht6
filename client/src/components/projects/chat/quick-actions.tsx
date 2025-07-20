"use client";

import React from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { QuickAction } from "@/types/chat";

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (prompt: string) => void;
}

export default function QuickActions({
  actions,
  onActionClick,
}: QuickActionsProps) {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className="group border-border from-card/40 to-card/20 hover:from-card/60 hover:to-card/40 hover:border-primary/20 cursor-pointer bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            onClick={() => onActionClick(action.prompt)}
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
        </motion.div>
      ))}
    </div>
  );
}
