import { Skeleton } from "@/components/ui/skeleton";

export default function HelloLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          <Skeleton className="mx-auto h-8 w-64" />
        </h1>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-2">
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <Skeleton className="mx-auto h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}
