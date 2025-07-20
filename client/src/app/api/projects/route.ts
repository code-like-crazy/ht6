import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/user";
import { createProject } from "@/server/services/project";
import { createProjectSchema } from "@/lib/validations/project";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedFields = createProjectSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.issues },
        { status: 400 },
      );
    }

    // Get the current user from the session
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, organizationId } = validatedFields.data;

    // Create the project
    const project = await createProject({
      name,
      description,
      organizationId,
      createdById: user.id,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);

    if (error instanceof Error) {
      if (error.message === "User is not a member of this organization") {
        return NextResponse.json(
          { error: "You are not a member of this organization" },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
