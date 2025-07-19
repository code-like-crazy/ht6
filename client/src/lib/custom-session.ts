import { cookies } from "next/headers";

export interface CustomSession {
  user: {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    [key: string]: unknown;
  };
  accessToken: string;
  idToken: string;
  createdAt: number;
}

export async function getCustomSession(): Promise<CustomSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appSession");

    if (!sessionCookie) {
      return null;
    }

    const sessionData = JSON.parse(sessionCookie.value);

    // Validate session structure
    if (!sessionData.user || !sessionData.accessToken) {
      return null;
    }

    // Check if session is expired (7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (Date.now() - sessionData.createdAt > maxAge) {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error("Error reading custom session:", error);
    return null;
  }
}

export function clearCustomSession() {
  // This would be used in a logout endpoint
  const response = new Response();
  response.headers.set(
    "Set-Cookie",
    "appSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
  );
  return response;
}
