"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Target,
  Users,
  Clock,
  CheckCircle,
  Quote,
} from "lucide-react";

export function WhatMakesUsDifferent() {
  const features = [
    {
      icon: Target,
      title: "Context-Aware Intelligence",
      description:
        "Unlike generic AI assistants, Loominal understands your specific project history, decisions, and team dynamics.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      icon: Shield,
      title: "Source Citations Always",
      description:
        "Every answer includes clickable references to the exact GitHub PR, Slack message, or Linear ticket where the information originated.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: Zap,
      title: "Instant Knowledge Transfer",
      description:
        "New team members get up to speed in days, not weeks. No more interrupting senior developers for context.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: Users,
      title: "Team-First Design",
      description:
        "Built for engineering teams who value documentation, knowledge sharing, and reducing onboarding friction.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Clock,
      title: "Real-Time Sync",
      description:
        "Automatically stays updated with your latest code changes, conversations, and project decisions across all tools.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: CheckCircle,
      title: "Privacy & Security",
      description:
        "Your code and conversations stay secure. We use industry-standard encryption and never train models on your data.",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  return (
    <section id="features" className="bg-secondary/20 py-20 sm:py-32">
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
              Why teams choose{" "}
              <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                Loominal
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl font-sans text-lg">
              We&apos;re not just another AI tool. We&apos;re purpose-built for
              engineering teams who want to eliminate knowledge silos and
              accelerate onboarding.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`group h-full border transition-all hover:shadow-lg ${feature.borderColor} hover:border-opacity-50`}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`mb-4 inline-flex rounded-lg p-3 ${feature.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-foreground mb-3 font-serif text-lg font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Social Proof / Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <Card className="border-primary/20 from-primary/5 to-accent/5 bg-gradient-to-br">
              <CardContent className="p-8 text-center">
                <Quote className="text-primary/40 mx-auto mb-6 h-12 w-12" />
                <blockquote className="text-foreground mb-6 font-serif text-xl font-medium italic sm:text-2xl">
                  &quot;Instead of spending weeks learning our codebase, new
                  engineers are contributing meaningful code within days.
                  Loominal eliminated the knowledge bottleneck that was slowing
                  down our entire team.&quot;
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-primary/20 h-12 w-12 rounded-full"></div>
                  <div className="text-left">
                    <div className="text-foreground font-serif font-semibold">
                      Gawd Knight
                    </div>
                    <div className="text-muted-foreground font-sans text-sm">
                      Senior Engineering Manager
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="from-primary/10 via-accent/10 to-primary/10 rounded-2xl bg-gradient-to-r p-8">
              <h3 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Ready to transform your team&apos;s knowledge sharing?
              </h3>
              <p className="text-muted-foreground mb-6 font-sans">
                Join engineering teams who&apos;ve eliminated onboarding
                friction and knowledge silos.
              </p>

              {/* Animated connecting lines */}
              <div className="relative mb-6">
                <motion.div
                  className="via-primary/50 mx-auto h-px w-32 bg-gradient-to-r from-transparent to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  viewport={{ once: true }}
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="text-muted-foreground flex items-center space-x-6 font-sans text-sm">
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Free to start
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    5-minute setup
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    No credit card
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
