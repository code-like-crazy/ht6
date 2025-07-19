import "server-only";

import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth0 } from "@/lib/auth0";

export interface UserData {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

export const getCurrentUser = async () => {
  const session = await auth0.getSession();

  if (!session?.user) {
    return null;
  }

  const dbUser = await getUserFromDatabase(session.user.sub);
  if (!dbUser) {
    return null;
  }

  return dbUser;
};

export async function syncUserToDatabase(userData: UserData) {
  // Check if user already exists by auth0Id
  const existingUserByAuth0Id = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.auth0Id, userData.sub))
    .limit(1);

  if (existingUserByAuth0Id.length > 0) {
    // User exists by auth0Id, update their information
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        name: userData.name || "",
        email: userData.email || "",
        imageUrl: userData.picture || null,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.auth0Id, userData.sub))
      .returning();

    return updatedUser;
  }

  // Check if user already exists by email
  const existingUserByEmail = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userData.email || ""))
    .limit(1);

  if (existingUserByEmail.length > 0) {
    // User exists by email but different auth0Id, update the auth0Id
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        auth0Id: userData.sub,
        name: userData.name || "",
        imageUrl: userData.picture || null,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.email, userData.email || ""))
      .returning();

    return updatedUser;
  }

  // User doesn't exist, create new user
  const [newUser] = await db
    .insert(usersTable)
    .values({
      auth0Id: userData.sub,
      name: userData.name || "",
      email: userData.email || "",
      imageUrl: userData.picture || null,
    })
    .returning();

  return newUser;
}

export async function getUserFromDatabase(auth0Id: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.auth0Id, auth0Id))
    .limit(1);

  return user || null;
}

export async function getUserById(id: number) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  return user || null;
}
