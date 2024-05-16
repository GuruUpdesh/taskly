import React, { Suspense } from "react";

import { currentUser } from "@clerk/nextjs/server";
import { type Metadata } from "next";

import { getTasksFromProject } from "~/actions/application/task-actions";
import { getAllNotifications } from "~/actions/notification-actions";
import BreadCrumbs from "~/app/components/layout/breadcrumbs/breadcrumbs";
import ToggleSidebarButton from "~/app/components/layout/sidebar/toggle-sidebar-button";
import Message from "~/app/components/Message";
import RecentTasks from "~/app/components/RecentTasks";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { type Task } from "~/server/db/schema";

import CurrentSprintGraph from "./components/CurrentSprintGraph";
import { DataCardFigure } from "./components/DataCard";
import UserGreeting from "./components/UserGreeting";

export const metadata: Metadata = {
	title: "Dashboard",
};

type ProjectPageProps = {
	params: {
		projectId: string;
	};
};

async function ProjectPage({ params: { projectId } }: ProjectPageProps) {
	const projectIdInt = parseInt(projectId, 10);
	const tasks: Task[] = (await getTasksFromProject(projectIdInt)) ?? [];

	const user = await currentUser();
	if (!user) {
		return (
			<Message type="error" className="min-w-[600px]">
				You must be logged in to access the dashboard
			</Message>
		);
	}

	const notificationsResult = await getAllNotifications(user.id);
	if (notificationsResult.error !== null) {
		console.error(notificationsResult.error);
		return (
			<Message type="error" className="min-w-[600px]">
				{notificationsResult.error}
			</Message>
		);
	}
	const notifications = notificationsResult.data;

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
					<Suspense
						fallback={
							<Skeleton className="col-span-4 h-[278px] w-full rounded-lg border" />
						}
					>
						<CurrentSprintGraph projectId={projectIdInt} />
					</Suspense>
				</section>
			</section>
		</div>
	);
}

export default ProjectPage;
