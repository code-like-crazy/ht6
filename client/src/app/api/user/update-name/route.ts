import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { updateUserName } from "@/server/services/user";
import { z } from "zod";

const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

export async function PATCH(request: NextRequest) {
  try {
    // Get the current user session
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = updateNameSchema.parse(body);

    // Update the user's name in the database
    const updatedUser = await updateUserName(
      session.user.sub,
      validatedData.name,
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user name" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Name updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        imageUrl: updatedUser.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error updating user name:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
