import { NextRequest, NextResponse } from "next/server";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const auth0Domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;

    if (!auth0Domain || !clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Auth0 configuration missing" },
        { status: 500 },
      );
    }

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

      const { email, password } = validatedFields.data;

      try {
        // Use Auth0's Resource Owner Password Grant
        const tokenResponse = await fetch(
          `https://${auth0Domain}/oauth/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grant_type: "password",
              username: email,
              password: password,
              client_id: clientId,
              client_secret: clientSecret,
              scope: "openid profile email",
              connection: "Username-Password-Authentication",
            }),
          },
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          return NextResponse.json(
            {
              error: tokenData.error_description || "Invalid credentials",
            },
            { status: 401 },
          );
        }

        // Instead of manually creating session cookies, redirect to our custom callback
        // which will then redirect to Auth0's callback to create the session properly
        const callbackUrl = new URL("/api/auth/custom-callback", req.url);
        callbackUrl.searchParams.set("access_token", tokenData.access_token);
        callbackUrl.searchParams.set("id_token", tokenData.id_token || "");
        callbackUrl.searchParams.set("state", "custom_login");

        return NextResponse.json({
          success: true,
          redirectUrl: callbackUrl.toString(),
        });
      } catch (error) {
        console.error("Auth0 authentication error:", error);
        return NextResponse.json(
          { error: "Authentication failed" },
          { status: 500 },
        );
      }
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

      const { name, email, password } = validatedFields.data;

      try {
        // Create user in Auth0
        const signupResponse = await fetch(
          `https://${auth0Domain}/dbconnections/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              client_id: clientId,
              email: email,
              password: password,
              name: name,
              connection: "Username-Password-Authentication",
            }),
          },
        );

        const signupData = await signupResponse.json();

        if (!signupResponse.ok) {
          return NextResponse.json(
            {
              error: signupData.description || "Registration failed",
            },
            { status: 400 },
          );
        }

        // After successful signup, automatically log them in
        const tokenResponse = await fetch(
          `https://${auth0Domain}/oauth/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grant_type: "password",
              username: email,
              password: password,
              client_id: clientId,
              client_secret: clientSecret,
              scope: "openid profile email",
              connection: "Username-Password-Authentication",
            }),
          },
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          // User was created but auto-login failed
          return NextResponse.json({
            success: true,
            message: "Account created successfully. Please sign in.",
            redirectUrl: "/login",
          });
        }

        // Use the same callback approach for signup
        const callbackUrl = new URL("/api/auth/custom-callback", req.url);
        callbackUrl.searchParams.set("access_token", tokenData.access_token);
        callbackUrl.searchParams.set("id_token", tokenData.id_token || "");
        callbackUrl.searchParams.set("state", "custom_signup");

        return NextResponse.json({
          success: true,
          redirectUrl: callbackUrl.toString(),
          message: "Account created successfully",
        });
      } catch (error) {
        console.error("Auth0 signup error:", error);
        return NextResponse.json(
          { error: "Registration failed" },
          { status: 500 },
        );
      }
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
