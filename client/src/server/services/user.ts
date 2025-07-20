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
    const existingUser = existingUserByAuth0Id[0];

    // Prepare update data - only update name if it's empty in DB or if Auth0 has a meaningful name
    const updateData: {
      name?: string;
      email: string;
      imageUrl: string | null;
      updatedAt: Date;
    } = {
      email: userData.email || existingUser.email,
      imageUrl: userData.picture || existingUser.imageUrl,
      updatedAt: new Date(),
    };

    // Only update name if:
    // 1. The existing user has no name (empty or null), OR
    // 2. The Auth0 name is different and not empty/default
    if (!existingUser.name || existingUser.name.trim() === "") {
      // User has no name in DB, use Auth0 name if available
      if (userData.name && userData.name.trim() !== "") {
        updateData.name = userData.name;
      }
    } else {
      // User has a name in DB, keep it unless Auth0 has a significantly different name
      // This preserves user-customized names
      updateData.name = existingUser.name;
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set(updateData)
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
    const existingUser = existingUserByEmail[0];

    // User exists by email but different auth0Id, update the auth0Id
    // Preserve existing name unless it's empty
    const nameToUse =
      existingUser.name && existingUser.name.trim() !== ""
        ? existingUser.name
        : userData.name || "";

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        auth0Id: userData.sub,
        name: nameToUse,
        imageUrl: userData.picture || existingUser.imageUrl,
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

export async function updateUserName(auth0Id: string, name: string) {
  const [updatedUser] = await db
    .update(usersTable)
    .set({
      name: name.trim(),
      updatedAt: new Date(),
    })
    .where(eq(usersTable.auth0Id, auth0Id))
    .returning();

  return updatedUser || null;
}

export async function updateUserNameByEmail(email: string, name: string) {
  const [updatedUser] = await db
    .update(usersTable)
    .set({
      name: name.trim(),
      updatedAt: new Date(),
    })
    .where(eq(usersTable.email, email))
    .returning();

  return updatedUser || null;
}
