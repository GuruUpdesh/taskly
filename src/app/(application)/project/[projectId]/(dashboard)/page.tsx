import React, { Suspense } from "react";

import { currentUser } from "@clerk/nextjs/server";
import { type Metadata } from "next";
import dynamic from "next/dynamic";

import LoadingBreadCrumbs from "~/components/layout/breadcrumbs/LoadingBreadCrumbs";
import Message from "~/components/Message";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "~/components/ui/card";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import CurrentSprintGraph from "~/features/dashboard/components/CurrentSprintGraph";
import Figures from "~/features/dashboard/components/Figures";
import UserGreeting from "~/features/dashboard/components/UserGreeting";
import { getAllNotifications } from "~/features/notifications/actions/notification-actions";
import RecentTasks from "~/features/tasks/components/RecentTasks";

const BreadCrumbs = dynamic(
	() => import("~/components/layout/breadcrumbs/breadcrumbs"),
	{
		ssr: false,
		loading: () => <LoadingBreadCrumbs />,
	},
);

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

	return (
		<div className="max-h-screen overflow-y-scroll pt-2">
			<header className="flex items-center justify-between gap-2 border-b bg-background px-4 pb-2">
				<div className="flex items-center gap-2">
					<SidebarTrigger />
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
							<RecentTasks number={8} projectId={projectIdInt} />
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
					<Figures projectId={projectIdInt} />
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
