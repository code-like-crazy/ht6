import { NextResponse } from "next/server";
import { getCustomSession } from "@/lib/custom-session";
import { syncUserToDatabase } from "@/server/services/user";

export async function POST() {
  try {
    // Get the current user session from custom session
    const session = await getCustomSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    // Sync user to database
    const dbUser = await syncUserToDatabase({
      sub: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });

    return NextResponse.json({
      message: "User synced successfully",
      user: dbUser,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
