import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { updateUserNameByEmail } from "@/server/services/user";
import { z } from "zod";

const updateNameSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

export async function PATCH(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = updateNameSchema.parse(body);

    // Update the user's name in the database by email
    const updatedUser = await updateUserNameByEmail(
      validatedData.email,
      validatedData.name,
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found or failed to update user name" },
        { status: 404 },
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
