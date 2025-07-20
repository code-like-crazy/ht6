import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/user";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
