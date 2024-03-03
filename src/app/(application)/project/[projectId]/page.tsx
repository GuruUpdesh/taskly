import React from "react";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import ToggleSidebarButton from "~/components/layout/sidebar/toggle-sidebar-button";
import UserGreeting from "~/components/page/project/user-greeting";

import {
	DataCardLineGraph,
	DataCardAreaGraph,
	DataCardFigure,
} from "~/components/dashboard/data-card";
import { Separator } from "~/components/ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "~/components/ui/card";
import RecentTasks from "~/components/page/project/recent-tasks";
import { getTasksFromProject } from "~/actions/application/task-actions";
import { type Notification, type Task } from "~/server/db/schema";
import { getAllNotifications } from "~/actions/notification-actions";
import { auth } from "@clerk/nextjs/server";
import { getCurrentSprintForProject } from "~/actions/application/sprint-actions";

type ProjectPageProps = {
	params: {
		projectId: string;
	};
};

async function ProjectPage({ params: { projectId } }: ProjectPageProps) {
	const tasks: Task[] = (await getTasksFromProject(Number(projectId))) ?? [];

	const sprint = await getCurrentSprintForProject(Number(projectId));
	console.log(sprint);

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

	const tasksForThisSprint = tasks.filter(
		(task: Task) => task.sprintId === sprint?.id,
	);

	const today = sprint?.startDate ?? new Date();

	const pastDates = [];
	for (let i = 0; i < 14; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		pastDates.push(date.toISOString().split("T")[0]);
	}
	pastDates.reverse();
	let counter = 0;
	const incrementBy = tasksForThisSprint.length / 14;
	const tasksCompletedBeforeDay = pastDates.map((date) => ({
		name: date ?? "",
		tasks: tasks.filter(
			(task: Task) =>
				task &&
				task.status === "done" &&
				task.sprintId === sprint?.id &&
				task.completedAt !== null &&
				task.completedAt.toISOString()?.split("T")[0] === date,
		).length,
		target: (counter += incrementBy),
		amt: 2400,
	}));

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
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Recent Tasks</CardDescription>
						</CardHeader>
						<CardContent>
							<RecentTasks number={10} />
						</CardContent>
					</Card>
					<Card>
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
				<Separator />
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
					{/* <DataCardAreaGraph
						title={"Tasks Completed (Past 2 Weeks)"}
						data={tasksCompletedPerDay}
					/> */}
					<DataCardLineGraph
						title={"Sprint Progress"}
						data={tasksCompletedBeforeDay}
					/>
				</section>
			</section>
		</div>
	);
}

export default ProjectPage;
