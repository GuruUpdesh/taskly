import React from "react";

import { auth } from "@clerk/nextjs/server";
import { type Metadata } from "next";

import { getTasksFromProject } from "~/actions/application/task-actions";
import { getAllNotifications } from "~/actions/notification-actions";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import ToggleSidebarButton from "~/components/layout/sidebar/toggle-sidebar-button";
import RecentTasks from "~/components/page/project/recent-tasks";
import UserGreeting from "~/components/page/project/user-greeting";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "~/components/ui/card";
import { type Notification, type Task } from "~/server/db/schema";

import { DataCardFigure } from "./components/DataCard";

export const metadata: Metadata = {
	title: "Dashboard",
};

type ProjectPageProps = {
	params: {
		projectId: string;
	};
};

async function ProjectPage({ params: { projectId } }: ProjectPageProps) {
	const tasks: Task[] = (await getTasksFromProject(Number(projectId))) ?? [];

	const user = auth();
	if (!user) {
		return;
	}

	const notifications: Notification[] =
		(await getAllNotifications(user.userId ?? "")) ?? [];

	const backlogTaskCount: number = tasks.filter(
		(task: Task) => task.status === "backlog",
	).length;

	const activeTaskCount: number = tasks.filter(
		(task: Task) => task.status === "inprogress",
	).length;

	const completedTaskCount: number = tasks.filter(
		(task: Task) => task.status === "done",
	).length;

	const totalTaskCount: number = tasks.length;

	return (
		<div className="max-h-screen overflow-y-scroll pt-2">
			<header className="flex items-center justify-between gap-2 border-b px-4 pb-2">
				<div className="flex items-center gap-2">
					<ToggleSidebarButton />
					<BreadCrumbs />
				</div>
				<div className="flex items-center gap-2"></div>
			</header>
			<section className="container flex flex-col pt-8">
				<UserGreeting />
				<section className="my-4 grid grid-cols-2 gap-4">
					<Card className="bg-foreground/5">
						<CardHeader className="pb-2">
							<CardDescription>Recent Tasks</CardDescription>
						</CardHeader>
						<CardContent>
							<RecentTasks number={10} />
						</CardContent>
					</Card>
					<Card className="bg-foreground/5">
						<CardHeader className="pb-2">
							<CardDescription>
								Recent Notifications
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-2">
								{notifications.map((notification) => (
									<div key={notification.id}>
										<a
											href={`/project/${projectId}/inbox/notification/${notification.id}`}
											className="cursor-pointer hover:underline"
										>
											{notification.message}
										</a>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</section>
				<section className="grid grid-cols-4 gap-4">
					<DataCardFigure
						cardTitle={backlogTaskCount.toString()}
						cardDescriptionUp="Backlog Tasks"
						cardDescriptionDown=""
					/>
					<DataCardFigure
						cardTitle={activeTaskCount.toString()}
						cardDescriptionUp="Active Tasks"
						cardDescriptionDown=""
					/>
					<DataCardFigure
						cardTitle={completedTaskCount.toString()}
						cardDescriptionUp="Completed Tasks"
						cardDescriptionDown=""
					/>
					<DataCardFigure
						cardTitle={totalTaskCount.toString()}
						cardDescriptionUp="Total Tasks"
						cardDescriptionDown=""
					/>
				</section>
			</section>
		</div>
	);
}

export default ProjectPage;
