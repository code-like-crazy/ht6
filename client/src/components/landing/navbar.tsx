"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="font-serif text-lg font-bold">L</span>
            </div>
            <span className="text-foreground font-serif text-xl font-bold">
              Loominal
            </span>
          </Link>
        </motion.div>

        {/* Navigation Links - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden items-center space-x-8 md:flex"
        >
          <Link
            href="#what-it-is"
            className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
          >
            What it is
          </Link>
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
          >
            Features
          </Link>
          <Link
            href="#faq"
            className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
          >
            FAQ
          </Link>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center space-x-3"
        >
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
}
