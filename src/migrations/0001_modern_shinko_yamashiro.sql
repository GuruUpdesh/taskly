ALTER TABLE "comments" DROP CONSTRAINT "comments_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" DROP CONSTRAINT "invites_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" DROP CONSTRAINT "invites_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "sprints" DROP CONSTRAINT "sprints_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "task_history" DROP CONSTRAINT "task_history_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "task_history" DROP CONSTRAINT "task_history_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignee_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_sprint_id_sprints_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_to_views" DROP CONSTRAINT "tasks_to_views_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_to_views" DROP CONSTRAINT "tasks_to_views_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_projects" DROP CONSTRAINT "users_to_projects_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_projects" DROP CONSTRAINT "users_to_projects_project_id_projects_id_fk";
