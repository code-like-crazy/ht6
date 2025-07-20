"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Integrations", href: "#what-it-is" },
      { name: "Pricing", href: "#" },
      { name: "Changelog", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Status", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security", href: "#" },
      { name: "GDPR", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", href: "#", icon: Github },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Email", href: "mailto:hello@loominal.ai", icon: Mail },
  ];

  return (
    <footer className="border-border/40 bg-secondary/10 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid gap-8 lg:grid-cols-6">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="mb-6">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
                    <span className="font-serif text-lg font-bold">L</span>
                  </div>
                  <span className="text-foreground font-serif text-xl font-bold">
                    Loominal
                  </span>
                </Link>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm font-sans text-sm leading-relaxed">
                Transform scattered project context into instant, cited answers.
                Built for engineering teams who value knowledge sharing and
                seamless onboarding.
              </p>

              {/* Newsletter Signup */}
              <div className="mb-6">
                <h4 className="text-foreground mb-3 font-serif text-sm font-semibold">
                  Stay updated
                </h4>
                <div className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/50 flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                  <Button size="sm" className="shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{social.name}</span>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Links Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-foreground mb-4 font-serif text-sm font-semibold">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-foreground mb-4 font-serif text-sm font-semibold">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-foreground mb-4 font-serif text-sm font-semibold">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-foreground mb-4 font-serif text-sm font-semibold">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-border/40 flex flex-col items-center justify-between border-t py-6 sm:flex-row"
        >
          <div className="text-muted-foreground mb-4 font-sans text-sm sm:mb-0">
            © {currentYear} Loominal. All rights reserved.
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground font-sans text-xs">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute right-0 bottom-0 left-0 h-px">
          <motion.div
            className="via-primary/30 h-full bg-gradient-to-r from-transparent to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </footer>
  );
}
