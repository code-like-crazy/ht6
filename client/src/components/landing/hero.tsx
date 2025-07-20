"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="from-background to-secondary/20 relative overflow-hidden bg-gradient-to-b py-20 sm:py-32">
      {/* Background SVG Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated Lines */}
      <motion.div
        className="via-primary absolute top-20 left-1/4 h-px w-32 bg-gradient-to-r from-transparent to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="via-accent absolute top-40 right-1/3 h-px w-24 bg-gradient-to-r from-transparent to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        viewport={{ once: true }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Knowledge Engine
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-foreground mb-6 font-serif text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Turn scattered context into{" "}
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              instant answers
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground mx-auto mb-10 max-w-2xl font-sans text-lg sm:text-xl"
          >
            Loominal connects your GitHub, Slack, Linear, and more to create an
            AI assistant that knows your project&apos;s full story. Get
            contextual answers with source citations in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="group">
              <Link href="/login">
                Start Building Knowledge
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#what-it-is">See How It Works</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="text-center">
              <div className="text-foreground mb-2 font-serif text-3xl font-bold">
                5+
              </div>
              <div className="text-muted-foreground font-sans text-sm">
                Integrated Tools
              </div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-2 font-serif text-3xl font-bold">
                <Zap className="text-primary inline h-8 w-8" />
              </div>
              <div className="text-muted-foreground font-sans text-sm">
                Instant Responses
              </div>
            </div>
            <div className="text-center">
              <div className="text-foreground mb-2 font-serif text-3xl font-bold">
                100%
              </div>
              <div className="text-muted-foreground font-sans text-sm">
                Source Citations
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="from-background absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t to-transparent" />
    </section>
  );
}
