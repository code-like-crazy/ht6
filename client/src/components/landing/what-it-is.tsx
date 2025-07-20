"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  GitBranch,
  MessageSquare,
  CheckSquare,
  Palette,
  FileText,
  Brain,
  ArrowRight,
  Search,
} from "lucide-react";

export function WhatItIs() {
  const integrations = [
    {
      icon: GitBranch,
      name: "GitHub",
      description: "Code, PRs, issues, discussions",
      color: "text-orange-500",
      delay: 0.1,
    },
    {
      icon: MessageSquare,
      name: "Slack",
      description: "Team conversations, decisions",
      color: "text-green-500",
      delay: 0.2,
    },
    {
      icon: CheckSquare,
      name: "Linear",
      description: "Tasks, planning, roadmaps",
      color: "text-blue-500",
      delay: 0.3,
    },
    {
      icon: Palette,
      name: "Figma",
      description: "Designs, specs, feedback",
      color: "text-purple-500",
      delay: 0.4,
    },
    {
      icon: FileText,
      name: "Notion",
      description: "Documentation, wikis",
      color: "text-gray-500",
      delay: 0.5,
    },
  ];

  return (
    <section id="what-it-is" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
              One AI that knows{" "}
              <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                everything
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl font-sans text-lg">
              Connect your development tools and transform scattered information
              into a unified knowledge base that answers any project question.
            </p>
          </motion.div>

          {/* Integration Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: integration.delay,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  <Card className="group border-border/50 hover:border-primary/50 h-full transition-all hover:shadow-md">
                    <CardContent className="flex flex-col items-center p-4 text-center">
                      <div
                        className={`bg-secondary/50 mb-3 rounded-lg p-3 ${integration.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-foreground mb-1 font-serif text-sm font-semibold">
                        {integration.name}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {integration.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Process Flow */}
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Step 1: Connect */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 border-primary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border">
                <span className="text-primary font-serif text-2xl font-bold">
                  1
                </span>
              </div>
              <h3 className="text-foreground mb-3 font-serif text-xl font-semibold">
                Connect Your Tools
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                Link your GitHub repositories, Slack workspaces, Linear
                projects, and other tools with secure OAuth connections.
              </p>

              {/* Animated connecting line */}
              <motion.div
                className="via-primary/50 mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent to-transparent lg:hidden"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: true }}
              />
            </motion.div>

            {/* Step 2: Process */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-accent/10 border-accent/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border">
                <Brain className="text-accent h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-3 font-serif text-xl font-semibold">
                AI Processes Everything
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                Our AI reads through your code, conversations, tickets, and
                documentation to understand your project&apos;s full context.
              </p>

              {/* Animated connecting line */}
              <motion.div
                className="via-accent/50 mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent to-transparent lg:hidden"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                viewport={{ once: true }}
              />
            </motion.div>

            {/* Step 3: Ask */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-secondary border-border mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border">
                <Search className="text-foreground h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-3 font-serif text-xl font-semibold">
                Ask Anything
              </h3>
              <p className="text-muted-foreground font-sans text-sm">
                Get instant, contextual answers with citations pointing back to
                the exact source—whether it&apos;s a PR comment or Slack thread.
              </p>
            </motion.div>
          </div>

          {/* Horizontal connecting lines for desktop */}
          <div className="relative mt-8 hidden lg:block">
            <motion.div
              className="via-primary/30 absolute top-1/2 left-1/3 h-px w-1/3 -translate-y-1/2 bg-gradient-to-r from-transparent to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="via-accent/30 absolute top-1/2 right-1/3 h-px w-1/3 -translate-y-1/2 bg-gradient-to-r from-transparent to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              viewport={{ once: true }}
            />

            {/* Arrow indicators */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              viewport={{ once: true }}
              className="text-primary/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              viewport={{ once: true }}
              className="text-accent/60 absolute top-1/2 right-1/4 -translate-y-1/2"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
