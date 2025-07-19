import { NextRequest, NextResponse } from "next/server";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const validatedFields = signInSchema.safeParse(body);

      if (!validatedFields.success) {
        return NextResponse.json(
          {
            error: "Invalid form data",
            details: validatedFields.error.flatten(),
          },
          { status: 400 },
        );
      }

      const { email } = validatedFields.data;

      // Redirect to Auth0 with email pre-filled
      // This maintains security while providing a better UX
      const loginUrl = `/auth/login?login_hint=${encodeURIComponent(email)}`;

      return NextResponse.json({
        success: true,
        redirectUrl: loginUrl,
      });
    } else if (action === "signup") {
      const validatedFields = signUpSchema.safeParse(body);

      if (!validatedFields.success) {
        return NextResponse.json(
          {
            error: "Invalid form data",
            details: validatedFields.error.flatten(),
          },
          { status: 400 },
        );
      }

      const { email } = validatedFields.data;

      // Redirect to Auth0 signup with email hint
      const signupUrl = `/auth/login?screen_hint=signup&login_hint=${encodeURIComponent(email)}`;

      return NextResponse.json({
        success: true,
        redirectUrl: signupUrl,
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Custom login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
