import { relations, type InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
	date,
	datetime,
	int,
	mysqlEnum,
	mysqlTableCreator,
	primaryKey,
	serial,
	text,
	varchar,
} from "drizzle-orm/mysql-core";
import type { z } from "zod";
import { startOfToday, addWeeks } from "date-fns";

export const mysqlTable = mysqlTableCreator((name) => `taskly_${name}`);

/**
 * Task Schema
 */
export const tasks = mysqlTable("tasks", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").default("").notNull(),
	status: mysqlEnum("status", ["todo", "inprogress", "done"])
		.default("todo")
		.notNull(),
	priority: mysqlEnum("priority", ["low", "medium", "high"])
		.default("low")
		.notNull(),
	type: mysqlEnum("type", ["task", "bug", "feature"])
		.default("task")
		.notNull(),
	assignee: varchar("assignee", { length: 255 }),
	projectId: int("project_id").notNull(),
	sprintId: int("sprint_id"),
});

export const notifications = mysqlTable("notifications", {
	id: serial("id").primaryKey(),
	date: datetime("date", { mode: "date", fsp: 6 }).notNull(),
	message: text("message").notNull(),
	userId: varchar("user_id", { length: 32 }).notNull(),
	projectId: int("project_id").notNull(),
});

// validators
export const selectTaskSchema = createSelectSchema(tasks);
export const insertTaskSchema = createInsertSchema(tasks);
export const insertTaskSchema__required = insertTaskSchema.required({
	title: true,
	description: true,
	status: true,
	priority: true,
	type: true,
	assignee: true,
	projectId: true,
	sprintId: true,
});

// types
export type Task = InferSelectModel<typeof tasks>;
export type NewTask = Omit<z.infer<typeof selectTaskSchema>, "id">;

// relations
export const taskRelations = relations(tasks, ({ one }) => ({
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id],
	}),
	assignee: one(users, {
		fields: [tasks.assignee],
		references: [users.userId],
	}),
	sprint: one(sprints, {
		fields: [tasks.sprintId],
		references: [sprints.id],
	}),
}));

/**
 * Project Schema
 */
export const projects = mysqlTable("projects", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	sprintDuration: int("sprint_duration").default(2).notNull(),
	sprintStart: date("sprint_start").default(startOfToday()).notNull(),
});

// validators
export const selectProjectSchema = createSelectSchema(projects);
export const insertProjectSchema = createInsertSchema(projects);

// types
export type Project = InferSelectModel<typeof projects>;
export type NewProject = z.infer<typeof insertProjectSchema>;

// relations
export const projectsRelations = relations(projects, ({ many }) => ({
	tasks: many(tasks),
	usersToProjects: many(usersToProjects),
	sprints: many(sprints),
}));

/**
 * User Schema
 */
export const users = mysqlTable("users", {
	userId: varchar("user_id", { length: 32 }).primaryKey(),
	username: varchar("username", { length: 255 }).notNull(),
	profilePicture: varchar("profile_picture", { length: 255 }).notNull(),
});

// validators
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

// types
export type User = InferSelectModel<typeof users>;
export type NewUser = z.infer<typeof insertUserSchema>;

// relations
export const usersRelations = relations(users, ({ many }) => ({
	usersToProjects: many(usersToProjects),
	tasks: many(tasks),
}));

/**
 * Users to Projects
 */

export type UserRole = "owner" | "member";

export const usersToProjects = mysqlTable(
	"users_to_projects",
	{
		userId: varchar("user_id", { length: 32 }).notNull(),
		projectId: int("project_id").notNull(),
		userRole: mysqlEnum("user_role", ["owner", "member"]).notNull(),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.projectId),
	}),
);

export const usersToProjectsRelations = relations(
	usersToProjects,
	({ one }) => ({
		user: one(users, {
			fields: [usersToProjects.userId],
			references: [users.userId],
		}),
		project: one(projects, {
			fields: [usersToProjects.projectId],
			references: [projects.id],
		}),
	}),
);

/**
 * Invite Schema
 */
export const invites = mysqlTable("invites", {
	id: serial("id").primaryKey(),
	date: datetime("date", { mode: "date", fsp: 6 }).notNull(),
	token: varchar("token", { length: 255 }).notNull().unique(),
	userId: varchar("user_id", { length: 32 }).notNull(),
	projectId: int("project_id").notNull(),
});

// validators
export const selectInviteSchema = createSelectSchema(invites);
export const insertInviteSchema = createInsertSchema(invites);

// types
export type Invite = InferSelectModel<typeof invites>;
export type NewInvite = z.infer<typeof insertInviteSchema>;

// relations
export const inviteRelations = relations(invites, ({ one }) => ({
	project: one(projects, {
		fields: [invites.projectId],
		references: [projects.id],
	}),
	user: one(users, {
		fields: [invites.userId],
		references: [users.userId],
	}),
}));

/**
 * Sprints Schema
 */
export const sprints = mysqlTable("sprints", {
	id: serial("id").primaryKey(),
	startDate: date("start_date").default(startOfToday()).notNull(),
	endDate: date("end_date").default(addWeeks(startOfToday(), 2)).notNull(),
	projectId: int("project_id").notNull(),
});

// types
export type Sprint = InferSelectModel<typeof sprints> & {name: string};

// relations
export const sprintRelations = relations(sprints, ({ one, many }) => ({
	project: one(projects, {
		fields: [sprints.projectId],
		references: [projects.id],
	}),
	tasks: many(tasks), 
}));