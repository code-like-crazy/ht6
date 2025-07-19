"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { SocialLogin } from "@/components/auth/social-login";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      className="from-background via-background to-secondary/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.075) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.075) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        backgroundPosition: "0 0, 0 0",
      }}
    >
      {/* Subtle overlay for depth */}
      <div className="via-background/50 to-secondary/10 pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent" />

      {/* Grainy gradient effects */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)
          `,
          filter: "blur(40px)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      />

      <Card className="border-border/50 relative z-10 w-full max-w-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader className="space-y-1 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-primary h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <CardTitle className="font-serif text-2xl">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="font-sans">
            {isSignUp
              ? "Join your team's knowledge engine"
              : "Sign in to access your team's knowledge"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSignUp ? (
            <SignUpForm onToggleMode={() => setIsSignUp(false)} />
          ) : (
            <SignInForm onToggleMode={() => setIsSignUp(true)} />
          )}

          <SocialLogin />
        </CardContent>
      </Card>
    </div>
  );
}
