import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
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
            <Skeleton className="h-6 w-6 rounded" />
          </div>
          <CardTitle className="font-serif text-2xl">
            <Skeleton className="mx-auto h-8 w-32" />
          </CardTitle>
          <CardDescription className="font-sans">
            <Skeleton className="mx-auto h-4 w-48" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Form skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="border-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                <Skeleton className="h-3 w-16" />
              </span>
            </div>
          </div>

          {/* Social login skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Toggle link skeleton */}
          <div className="text-center">
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
