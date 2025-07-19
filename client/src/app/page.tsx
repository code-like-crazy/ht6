import { auth0 } from "@/lib/auth0";
import { Button } from "@/components/ui/button";
import { syncUserToDatabase } from "@/server/services/user";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-8 text-2xl font-bold">HT6 Auth Test</h1>
          <div className="space-x-4">
            <Button asChild>
              <a href="/login">Get Started</a>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Automatically sync user to database when they visit the page
  const dbUser = await syncUserToDatabase({
    sub: session.user.sub,
    name: session.user.name,
    email: session.user.email,
    picture: session.user.picture,
  });

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">Welcome!</h1>
        <div className="mb-6 max-w-md rounded-lg bg-gray-50 p-6 text-left">
          <h2 className="mb-4 font-semibold">Auth0 User Info:</h2>
          <p>
            <strong>Name:</strong> {session.user.name}
          </p>
          <p>
            <strong>Email:</strong> {session.user.email}
          </p>
          <p>
            <strong>Auth0 ID:</strong> {session.user.sub}
          </p>
          {session.user.picture && (
            <div className="mt-4">
              <img
                src={session.user.picture}
                alt="Profile"
                className="h-16 w-16 rounded-full"
              />
            </div>
          )}
        </div>

        <div className="mb-6 max-w-md rounded-lg bg-blue-50 p-6 text-left">
          <h2 className="mb-4 font-semibold">Database User Info:</h2>
          <p>
            <strong>Database ID:</strong> {dbUser.id}
          </p>
          <p>
            <strong>Name:</strong> {dbUser.name}
          </p>
          <p>
            <strong>Email:</strong> {dbUser.email}
          </p>
          <p>
            <strong>Auth0 ID:</strong> {dbUser.auth0Id}
          </p>
          <p>
            <strong>Created:</strong> {dbUser.createdAt.toLocaleDateString()}
          </p>
          <p>
            <strong>Updated:</strong> {dbUser.updatedAt.toLocaleDateString()}
          </p>
        </div>

        <Button asChild>
          <a href="/auth/logout">Log out</a>
        </Button>
      </div>
    </main>
  );
}
