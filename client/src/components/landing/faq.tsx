"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How does Loominal connect to my development tools?",
      answer:
        "Loominal uses secure OAuth connections and API integrations to access your GitHub repositories, Slack workspaces, Linear projects, and other tools. We only request the minimum permissions needed and never store your credentials permanently. All connections are encrypted and can be revoked at any time.",
    },
    {
      question: "What happens to my code and private conversations?",
      answer:
        "Your data privacy is our top priority. We use industry-standard encryption for all data in transit and at rest. We never train AI models on your private data, and we don't share your information with third parties. You maintain full control over what data Loominal can access.",
    },
    {
      question: "How accurate are the AI responses and citations?",
      answer:
        "Loominal provides highly accurate responses by analyzing your actual project data rather than making assumptions. Every answer includes direct citations to the source material, so you can verify the information yourself. Our AI is specifically trained to understand software development contexts and team dynamics.",
    },
    {
      question:
        "Can I control which repositories and channels Loominal accesses?",
      answer:
        "Absolutely. You have granular control over which repositories, Slack channels, Linear projects, and other resources Loominal can access. You can add or remove access to specific resources at any time through your project settings.",
    },
    {
      question: "How long does it take to set up and see results?",
      answer:
        "Most teams are up and running within 5-10 minutes. After connecting your tools, Loominal immediately starts processing your data. You'll see initial results right away, with more comprehensive knowledge building over the first few hours as more data is processed.",
    },
    {
      question: "Is there a limit to how much data Loominal can process?",
      answer:
        "Loominal is designed to handle projects of any size, from small startups to large enterprise codebases. We automatically optimize processing for your specific project size and can scale to accommodate growing teams and expanding codebases.",
    },
    {
      question: "Can multiple team members use the same Loominal project?",
      answer:
        "Yes! Loominal is built for teams. Multiple team members can access the same project knowledge base, ask questions, and benefit from the collective understanding. You can manage team access and permissions through your organization settings.",
    },
    {
      question: "What if I need to remove Loominal from my tools?",
      answer:
        "You can disconnect Loominal from any of your tools at any time. Simply revoke the OAuth permissions or remove the API keys from your project settings. All processed data related to your project will be permanently deleted upon request.",
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
              Frequently asked{" "}
              <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl font-sans text-lg">
              Everything you need to know about Loominal, privacy, security, and
              getting started.
            </p>

            {/* Decorative line */}
            <motion.div
              className="via-primary/50 mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-border/50 bg-card/50 hover:bg-card/80 rounded-lg border px-6 py-2 transition-all"
                  >
                    <AccordionTrigger className="text-foreground text-left font-serif font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-sans leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="border-primary/20 from-primary/5 to-accent/5 rounded-2xl border bg-gradient-to-br p-8">
              <h3 className="text-foreground mb-4 font-serif text-xl font-semibold">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6 font-sans">
                We&apos;re here to help you get the most out of Loominal for
                your team.
              </p>

              {/* Contact options */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:support@loominal.ai"
                  className="text-primary hover:text-primary/80 font-sans text-sm transition-colors"
                >
                  support@loominal.ai
                </a>
                <span className="text-muted-foreground hidden sm:inline">
                  •
                </span>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-sans text-sm transition-colors"
                >
                  Schedule a demo
                </a>
                <span className="text-muted-foreground hidden sm:inline">
                  •
                </span>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-sans text-sm transition-colors"
                >
                  Documentation
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
