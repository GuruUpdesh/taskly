import { type InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import {
	bigint,
	mysqlEnum,
	mysqlTableCreator,
	text,
	varchar,
} from "drizzle-orm/mysql-core";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `taskly_${name}`);

export const task = mysqlTable("task", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	status: mysqlEnum("status", ["todo", "inprogress", "done"]),
	priority: mysqlEnum("priority", ["low", "medium", "high"]),
	type: mysqlEnum("type", ["task", "bug", "feature"]),
});

export const project = mysqlTable("project", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	status: mysqlEnum("status", ["active", "inactive"]),
});

export const user = mysqlTable("user", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	username: varchar("username", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	avatar: varchar("avatar", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	timezone: varchar("timezone", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 255 }).notNull(),
	role: mysqlEnum("role", ["1", "2", "3"]),
	status: mysqlEnum("status", ["active", "inactive"]),
});

export const insertTaskSchema = z.object({
	title: z.string().refine((val) => val !== "", {
		message: "Title is required",
	}),
	description: z.string().refine((val) => val !== "", {
		message: "Description is required",
	}),
	status: z.enum(["todo", "inprogress", "done"]),
	priority: z.enum(["low", "medium", "high"]),
	type: z.enum(["task", "bug", "feature"]),
});

export const insertProjectSchema = z.object({
	name: z.string().refine((val) => val !== "", {
		message: "Name is required",
	}),
	description: z.string().refine((val) => val !== "", {
		message: "Description is required",
	}),
	status: z.enum(["active", "inactive"]),
});

export const insertUserSchema = z.object({
	username: z.string().min(3).max(20),
	name: z.string().min(1).max(50),
	email: z.string().email(),
	avatar: z.string().url(),
	password: z.string().min(8),
	timezone: z.string().min(3).max(50),
	phone: z.string().min(10).max(15),
	role: z.enum(["1", "2", "3"]),
	status: z.enum(["active", "inactive"]),
});

export const selectTaskSchema = createSelectSchema(task);
export type Task = InferSelectModel<typeof task>;
export type NewTask = z.infer<typeof insertTaskSchema>;

export const selectProjectSchema = createSelectSchema(project);
export type Project = InferSelectModel<typeof project>;
export type NewProject = z.infer<typeof insertProjectSchema>;

export const selectUserSchema = createSelectSchema(user);
export type User = InferSelectModel<typeof user>;
export type NewUser = z.infer<typeof insertUserSchema>;

// export const posts = mysqlTable(
//   "post",
//   {
//     id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
//     createdByName:  varchar("name", { length: 255 }).notNull(),
//     content: varchar("content", { length: 255 }).notNull(),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//   },
// );

// export type Post = InferSelectModel<typeof posts>;
// export type NewPost = InferInsertModel<typeof posts>;

// export const users = mysqlTable("user", {
//   id: varchar("id", { length: 255 }).notNull().primaryKey(),
//   name: varchar("name", { length: 255 }),
//   email: varchar("email", { length: 255 }).notNull(),
//   emailVerified: timestamp("emailVerified", {
//     mode: "date",
//     fsp: 3,
//   }).default(sql`CURRENT_TIMESTAMP(3)`),
//   image: varchar("image", { length: 255 }),
// });

// export const usersRelations = relations(users, ({ many }) => ({
//   accounts: many(accounts),
// }));

// export const accounts = mysqlTable(
//   "account",
//   {
//     userId: varchar("userId", { length: 255 }).notNull(),
//     type: varchar("type", { length: 255 })
//       .$type<AdapterAccount["type"]>()
//       .notNull(),
//     provider: varchar("provider", { length: 255 }).notNull(),
//     providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: int("expires_at"),
//     token_type: varchar("token_type", { length: 255 }),
//     scope: varchar("scope", { length: 255 }),
//     id_token: text("id_token"),
//     session_state: varchar("session_state", { length: 255 }),
//   },
//   (account) => ({
//     compoundKey: primaryKey(account.provider, account.providerAccountId),
//     userIdIdx: index("userId_idx").on(account.userId),
//   }),
// );

// export const accountsRelations = relations(accounts, ({ one }) => ({
//   user: one(users, { fields: [accounts.userId], references: [users.id] }),
// }));

// export const sessions = mysqlTable(
//   "session",
//   {
//     sessionToken: varchar("sessionToken", { length: 255 })
//       .notNull()
//       .primaryKey(),
//     userId: varchar("userId", { length: 255 }).notNull(),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (session) => ({
//     userIdIdx: index("userId_idx").on(session.userId),
//   }),
// );

// export const sessionsRelations = relations(sessions, ({ one }) => ({
//   user: one(users, { fields: [sessions.userId], references: [users.id] }),
// }));

// export const verificationTokens = mysqlTable(
//   "verificationToken",
//   {
//     identifier: varchar("identifier", { length: 255 }).notNull(),
//     token: varchar("token", { length: 255 }).notNull(),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (vt) => ({
//     compoundKey: primaryKey(vt.identifier, vt.token),
//   }),
// );
