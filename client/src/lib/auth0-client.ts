import { ManagementClient, AuthenticationClient } from "auth0";

const auth0Domain = process.env.AUTH0_DOMAIN!;
const clientId = process.env.AUTH0_CLIENT_ID!;
const clientSecret = process.env.AUTH0_CLIENT_SECRET!;

export const managementClient = new ManagementClient({
  domain: auth0Domain,
  clientId: clientId,
  clientSecret: clientSecret,
});

export const authenticationClient = new AuthenticationClient({
  domain: auth0Domain,
  clientId: clientId,
});

export class CustomAuth0Client {
  private domain: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.domain = auth0Domain;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  // Sign up new user
  async signUp(email: string, password: string, name: string) {
    try {
      const response = await authenticationClient.database.signUp({
        connection: "Username-Password-Authentication",
        email,
        password,
        user_metadata: {
          name,
        },
      });
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Sign up failed",
      );
    }
  }

  // Login with email/password using Authorization Code Flow with PKCE
  async login(email: string, password: string) {
    try {
      const response = await authenticationClient.oauth.passwordGrant({
        username: email,
        password,
        scope: "openid profile email",
        audience: `https://${this.domain}/userinfo`,
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  // Get user profile
  async getUserProfile(accessToken: string) {
    try {
      const response = await fetch(`https://${this.domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get user profile");
      }

      return await response.json();
    } catch (error) {
      throw new Error("Failed to get user profile");
    }
  }

  // Password reset
  async resetPassword(email: string) {
    try {
      const response = await authenticationClient.database.changePassword({
        connection: "Username-Password-Authentication",
        email,
      });
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Password reset failed",
      );
    }
  }
}

export const customAuth0Client = new CustomAuth0Client();
