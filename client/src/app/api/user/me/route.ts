import { NextResponse } from "next/server";
import { getCustomSession } from "@/lib/custom-session";

export async function GET() {
  try {
    const session = await getCustomSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Transform the session user data to match the expected User type
    const user = {
      id: 0, // We don't have a database ID from the session
      auth0Id: session.user.sub,
      name: session.user.name || session.user.email.split("@")[0],
      email: session.user.email,
      imageUrl: session.user.picture || null,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.createdAt),
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user session:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
