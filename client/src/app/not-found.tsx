"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction, Clock } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="from-background to-secondary/20 min-h-screen bg-gradient-to-b">
      {/* Background SVG Pattern */}
      <div className="absolute inset-0 opacity-20">
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
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div
        className="via-accent absolute top-40 right-1/3 h-px w-24 bg-gradient-to-r from-transparent to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-primary/10 border-primary/20 text-primary mx-auto flex h-20 w-20 items-center justify-center rounded-full border">
              <Construction className="h-10 w-10" />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-foreground mb-6 font-serif text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Under Construction
          </motion.h1>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8 space-y-4"
          >
            <p className="text-muted-foreground font-sans text-lg sm:text-xl">
              We&apos;re currently in production mode with limited access.
            </p>
            <div className="border-primary/20 bg-primary/5 rounded-lg border p-6 text-left">
              <div className="mb-3 flex items-center">
                <Clock className="text-primary mr-2 h-5 w-5" />
                <span className="text-foreground font-sans font-semibold">
                  Temporary Restriction
                </span>
              </div>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                Due to time constraints, we&apos;ve temporarily disabled access
                to the dashboard and other application features in production.
                Only the landing page is currently available to showcase
                Loominal&apos;s vision and capabilities.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="group">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Landing Page
              </Link>
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12"
          >
            <p className="text-muted-foreground font-sans text-sm">
              Interested in the full experience?{" "}
              <span className="text-primary font-medium">
                Contact us for a demo
              </span>{" "}
              or check back soon for updates.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="from-background absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t to-transparent" />
    </div>
  );
}
