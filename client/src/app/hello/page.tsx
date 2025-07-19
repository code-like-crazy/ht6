import Link from "next/link";

interface HelloResponse {
  result: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

async function getHelloData(): Promise<HelloResponse | ErrorResponse> {
  try {
    const response = await fetch("http://localhost:5001/api/hello", {});

    if (!response.ok) {
      const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      return {
        error: "Failed to fetch data from server",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching hello data:", error);

    return {
      error: "Unable to connect to server",
      details:
        process.env.NODE_ENV === "development"
          ? `${error instanceof Error ? error.message : "Unknown error"} - Make sure Flask server is running on port 5001`
          : undefined,
    };
  }
}

function isErrorResponse(
  data: HelloResponse | ErrorResponse,
): data is ErrorResponse {
  return "error" in data;
}

export default async function HelloPage() {
  const data = await getHelloData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Hello from Flask Backend
        </h1>

        {isErrorResponse(data) ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="mb-2 text-sm text-red-600">Error:</p>
            <p className="mb-2 text-lg font-semibold text-red-800">
              {data.error}
            </p>
            {data.details && process.env.NODE_ENV === "development" && (
              <div className="mt-3 rounded border bg-red-100 p-3">
                <p className="font-mono text-xs text-red-700">
                  Development Details: {data.details}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="mb-2 text-sm text-gray-600">
              Response from /api/hello:
            </p>
            <p className="text-lg font-semibold text-blue-800">{data.result}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
