import { auth0 } from "@/lib/auth0";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-8 text-2xl font-bold">HT6 Auth Test</h1>
          <div className="space-x-4">
            <Button asChild>
              <a href="/auth/login?screen_hint=signup">Sign up</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/auth/login">Log in</a>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">Welcome!</h1>
        <div className="mb-6 max-w-md rounded-lg bg-gray-50 p-6 text-left">
          <h2 className="mb-4 font-semibold">User Info:</h2>
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
        <Button asChild>
          <a href="/auth/logout">Log out</a>
        </Button>
      </div>
    </main>
  );
}
