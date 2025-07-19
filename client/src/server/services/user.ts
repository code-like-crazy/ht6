import "server-only";

import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export interface UserData {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

export async function syncUserToDatabase(userData: UserData) {
  // Check if user already exists in database
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.auth0Id, userData.sub))
    .limit(1);

  if (existingUser.length > 0) {
    // User exists, update their information
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
  } else {
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
