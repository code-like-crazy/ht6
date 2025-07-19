import { auth0 } from "@/lib/auth0";
import { Button } from "@/components/ui/button";
import { syncUserToDatabase } from "@/server/services/user";
import { getCustomSession } from "@/lib/custom-session";

export default async function Home() {
  // Try to get Auth0 session first, but handle JWE errors gracefully
  let session = null;
  try {
    session = await auth0.getSession();
  } catch (error) {
    // If there's a JWE error, it means there's an invalid session cookie
    // We'll ignore it and try custom session instead
    console.log(
      "Auth0 session error (likely invalid JWE), trying custom session",
    );
  }

  let isCustomSession = false;
  let user = null;

  // If no Auth0 session, try custom session
  if (!session) {
    const customSession = await getCustomSession();
    if (customSession) {
      user = customSession.user;
      isCustomSession = true;
    }
  } else {
    user = session.user;
  }

  if (!user) {
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
  let dbUser;
  try {
    console.log("Syncing user to database:", {
      sub: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });

    dbUser = await syncUserToDatabase({
      sub: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    console.error("Failed to sync user to database:", error);
    console.error("User data:", user);

    // Return error page instead of crashing
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-8 text-2xl font-bold text-red-600">
            Database Error
          </h1>
          <p className="mb-4">Failed to sync user to database.</p>
          <p className="mb-4 text-sm text-gray-600">
            User ID: {user.sub || "missing"}
          </p>
          <Button asChild>
            <a href="/api/auth/clear-cookies">Clear Cookies & Try Again</a>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button asChild>
        <a href="/api/auth/clear-cookies">Clear Cookies & Try Again</a>
      </Button>
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">Welcome!</h1>
        <div className="mb-6 max-w-md rounded-lg bg-gray-50 p-6 text-left">
          <h2 className="mb-4 font-semibold">
            {isCustomSession ? "Custom Session" : "Auth0 Session"} User Info:
          </h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Auth0 ID:</strong> {user.sub}
          </p>
          {user.picture && (
            <div className="mt-4">
              <img
                src={user.picture}
                alt="Profile"
                className="h-16 w-16 rounded-full"
              />
            </div>
          )}
          {isCustomSession && (
            <p className="mt-2 text-sm text-green-600">
              ✅ Logged in via custom form
            </p>
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
          <a
            href={isCustomSession ? "/api/auth/custom-logout" : "/auth/logout"}
          >
            Log out
          </a>
        </Button>
      </div>
    </main>
  );
}
