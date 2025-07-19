import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  auth0Id: varchar({ length: 255 }).notNull().unique(), // Auth0 user ID (sub)
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  imageUrl: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const organizationsTable = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  imageUrl: varchar({ length: 255 }),
  icon: varchar({ length: 50 }), // Store the icon name
  createdById: integer()
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const organizationMembersTable = pgTable("organization_members", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  organizationId: integer()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  role: varchar({ length: 50 }).notNull().default("member"), // owner, manager, member
  invitedAt: timestamp(),
  joinedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  description: text(),
  organizationId: integer()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  createdById: integer()
    .notNull()
    .references(() => usersTable.id),
  settings: json().default({}),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const connectionsTable = pgTable("connections", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer()
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  type: varchar({ length: 50 }).notNull(), // github, linear, slack, figma, notion
  name: varchar({ length: 255 }).notNull(),
  credentials: json().notNull(), // encrypted credentials/tokens
  settings: json().default({}),
  isActive: integer().notNull().default(1), // 1 for active, 0 for inactive
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  organizationsCreated: many(organizationsTable),
  organizationMemberships: many(organizationMembersTable),
  projectsCreated: many(projectsTable),
}));

export const organizationsRelations = relations(
  organizationsTable,
  ({ one, many }) => ({
    createdBy: one(usersTable, {
      fields: [organizationsTable.createdById],
      references: [usersTable.id],
    }),
    members: many(organizationMembersTable),
    projects: many(projectsTable),
  }),
);

export const organizationMembersRelations = relations(
  organizationMembersTable,
  ({ one }) => ({
    organization: one(organizationsTable, {
      fields: [organizationMembersTable.organizationId],
      references: [organizationsTable.id],
    }),
    user: one(usersTable, {
      fields: [organizationMembersTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [projectsTable.organizationId],
    references: [organizationsTable.id],
  }),
  createdBy: one(usersTable, {
    fields: [projectsTable.createdById],
    references: [usersTable.id],
  }),
  connections: many(connectionsTable),
}));

export const connectionsRelations = relations(connectionsTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [connectionsTable.projectId],
    references: [projectsTable.id],
  }),
}));
