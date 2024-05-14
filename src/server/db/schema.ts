import { startOfToday, addWeeks } from "date-fns";
import { relations, type InferSelectModel } from "drizzle-orm";
import {
	pgTable,
	pgEnum,
	integer,
	serial,
	text,
	varchar,
	boolean,
	primaryKey,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Task Schema
 */
export const StatusEnum = pgEnum("status", [
	"backlog",
	"todo",
	"inprogress",
	"inreview",
	"done",
]);
export const PointsEnum = pgEnum("points", ["0", "1", "2", "3", "4", "5"]);
export const PriorityEnum = pgEnum("priority", [
	"none",
	"low",
	"medium",
	"high",
	"critical",
]);
export const TypeEnum = pgEnum("type", [
	"task",
	"bug",
	"feature",
	"improvement",
	"research",
	"testing",
]);
export const tasks = pgTable("tasks", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").default("").notNull(),
	status: StatusEnum("status").default("todo").notNull(),
	points: PointsEnum("points").default("0").notNull(),
	priority: PriorityEnum("priority").default("low").notNull(),
	type: TypeEnum("type").default("task").notNull(),
	boardOrder: integer("board_order").notNull().default(0),
	backlogOrder: integer("backlog_order").notNull().default(0),
	lastEditedAt: timestamp("last_edit", { precision: 6, withTimezone: true }),
	insertedDate: timestamp("insert_date", { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
	assignee: varchar("assignee", { length: 255 }),
	projectId: integer("project_id").notNull(),
	sprintId: integer("sprint_id").default(-1).notNull(),
	branchName: varchar("branch_name", { length: 255 }),
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
	backlogOrder: true,
	boardOrder: true,
});

// types
export type Task = InferSelectModel<typeof tasks>;
export type NewTask = Omit<z.infer<typeof selectTaskSchema>, "id">;

// relations
export const taskRelations = relations(tasks, ({ one, many }) => ({
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id],
	}),
	assignee: one(users, {
		fields: [tasks.assignee],
		references: [users.userId],
	}),
	views: many(tasksToViews),
	sprint: one(sprints, {
		fields: [tasks.sprintId],
		references: [sprints.id],
	}),
	taskHistory: many(taskHistory),
	comments: many(comments),
}));

/**
 * Project Schema
 */
export const projects = pgTable("projects", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	sprintDuration: integer("sprint_duration").default(2).notNull(),
	sprintStart: timestamp("sprint_start", { precision: 6, withTimezone: true })
		.default(startOfToday())
		.notNull(),
	description: text("description"),
	image: varchar("image", { length: 1000 }),
	color: varchar("color", { length: 7 }).default("#000000").notNull(),
	isAiEnabled: boolean("is_ai_enabled").default(false).notNull(),
	githubIntegrationId: integer("github_integration_id"),
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
 * Project to Integration Schema
 */
export const IntegrationEnum = pgEnum("integration", ["github"]);
export const projectToIntegrations = pgTable("project_to_integrations", {
	id: serial("id").primaryKey(),
	projectId: integer("project_id").notNull(),
	integrationId: IntegrationEnum("type").default("github").notNull(),
	userId: varchar("user_id", { length: 32 }).notNull(),
});

// validators
export const projectToIntegrationsSchema = createSelectSchema(
	projectToIntegrations,
);

// relations
export const projectToIntegrationsRelations = relations(
	projectToIntegrations,
	({ one }) => ({
		user: one(users, {
			fields: [projectToIntegrations.userId],
			references: [users.userId],
		}),
	}),
);

/**
 * User Schema
 */
export const users = pgTable("users", {
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
	views: many(tasksToViews),
	taskHistory: many(taskHistory),
	comments: many(comments),
	pendingIntegrations: many(projectToIntegrations),
}));

/**
 * Users to Projects
 */
export const userRoles = ["owner", "admin", "member"] as const;

export const UserRolesEnum = pgEnum("user_role", userRoles);
export const usersToProjects = pgTable(
	"users_to_projects",
	{
		userId: varchar("user_id", { length: 32 }).notNull(),
		projectId: integer("project_id").notNull(),
		userRole: UserRolesEnum("user_role").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.projectId] }),
	}),
);

// validators
export const usersToProjectsSchema = createInsertSchema(usersToProjects);

// types
export type UsersToProjects = InferSelectModel<typeof usersToProjects>;
export type UserRole = InferSelectModel<typeof usersToProjects>["userRole"];

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
export const invites = pgTable("invites", {
	id: serial("id").primaryKey(),
	date: timestamp("date", { precision: 6, withTimezone: true }).notNull(),
	token: varchar("token", { length: 255 }).notNull().unique(),
	userId: varchar("user_id", { length: 32 }).notNull(),
	projectId: integer("project_id").notNull(),
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
 * Task to Views
 */
export const tasksToViews = pgTable(
	"tasks_to_views",
	{
		taskId: integer("task_id").notNull(),
		userId: varchar("user_id", { length: 32 }).notNull(),
		viewedAt: timestamp("viewed_at", {
			precision: 6,
			withTimezone: true,
		}).notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.taskId] }),
	}),
);

// validators
export const selectTaskToViewSchema = createSelectSchema(tasksToViews);

// types
export type TaskToView = InferSelectModel<typeof tasksToViews>;

// relations
export const taskToViewRelations = relations(tasksToViews, ({ one }) => ({
	task: one(tasks, {
		fields: [tasksToViews.taskId],
		references: [tasks.id],
	}),
	user: one(users, {
		fields: [tasksToViews.userId],
		references: [users.userId],
	}),
}));

/**
 * Sprints
 */

export const sprints = pgTable("sprints", {
	id: serial("id").primaryKey(),
	startDate: timestamp("start_date", { precision: 6, withTimezone: true })
		.default(startOfToday())
		.notNull(),
	endDate: timestamp("end_date", { precision: 6, withTimezone: true })
		.default(addWeeks(startOfToday(), 2))
		.notNull(),
	projectId: integer("project_id").notNull(),
});

// types
export interface Sprint extends InferSelectModel<typeof sprints> {
	name: string;
}

// relations
export const sprintRelations = relations(sprints, ({ one, many }) => ({
	project: one(projects, {
		fields: [sprints.projectId],
		references: [projects.id],
	}),
	tasks: many(tasks),
}));

/**
 * Notifications
 */

export const notifications = pgTable("notifications", {
	id: serial("id").primaryKey(),
	date: timestamp("date", { precision: 6, withTimezone: true }).notNull(),
	message: text("message").notNull(),
	userId: varchar("user_id", { length: 32 }).notNull(),
	taskId: integer("task_id"),
	projectId: integer("project_id").notNull(),
	readAt: timestamp("read_at", { precision: 6, withTimezone: true }),
});

// validators
export const selectNotificationSchema = createSelectSchema(notifications);
export const insertNotificationSchema = createInsertSchema(notifications);

// types
export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = z.infer<typeof insertNotificationSchema>;

// relations
export const notificationRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.userId],
	}),
	project: one(projects, {
		fields: [notifications.projectId],
		references: [projects.id],
	}),
	task: one(tasks, {
		fields: [notifications.taskId],
		references: [tasks.id],
	}),
}));

/**
 * Task History
 */
export const PropertyKeyEnum = pgEnum("property_key", [
	"status",
	"priority",
	"assignee",
	"sprintId",
	"type",
	"points",
]);
export const taskHistory = pgTable("task_history", {
	id: serial("id").primaryKey(),
	comment: varchar("comment", { length: 255 }),
	taskId: integer("task_id").notNull(),
	propertyKey: PropertyKeyEnum("property_key"),
	propertyValue: varchar("property_value", { length: 255 }),
	oldPropertyValue: varchar("old_property_value", { length: 255 }),
	userId: varchar("user_id", { length: 255 }).notNull(),
	insertedDate: timestamp("inserted_date", {
		precision: 6,
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
});

// validators
export const selectTaskHistorySchema = createSelectSchema(taskHistory);
export const insertTaskHistorySchema = z.object({
	taskId: selectTaskHistorySchema.shape.taskId,
	propertyKey: selectTaskHistorySchema.shape.propertyKey,
	propertyValue: selectTaskHistorySchema.shape.propertyValue,
	oldPropertyValue: selectTaskHistorySchema.shape.oldPropertyValue,
	userId: selectTaskHistorySchema.shape.userId,
	insertedDate: selectTaskHistorySchema.shape.insertedDate,
});

// types
export type TaskHistory = InferSelectModel<typeof taskHistory>;

// relations
export const taskHistoryRelations = relations(taskHistory, ({ one }) => ({
	task: one(tasks, {
		fields: [taskHistory.taskId],
		references: [tasks.id],
	}),
	user: one(users, {
		fields: [taskHistory.userId],
		references: [users.userId],
	}),
}));

/**
 * Comments
 */

export const comments = pgTable("comments", {
	id: serial("id").primaryKey(),
	comment: text("comment").notNull(),
	taskId: integer("task_id").notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	insertedDate: timestamp("inserted_date", {
		precision: 6,
		withTimezone: true,
	})
		.notNull()
		.defaultNow(),
});

// types
export type Comment = InferSelectModel<typeof comments>;

// relations
export const commentsRelations = relations(comments, ({ one }) => ({
	task: one(tasks, {
		fields: [comments.taskId],
		references: [tasks.id],
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.userId],
	}),
}));
