import React from "react";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import ToggleSidebarButton from "~/components/layout/sidebar/toggle-sidebar-button";
import UserGreeting from "~/components/page/project/user-greeting";
import { Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";

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

function ProjectPage() {
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
						<CardContent></CardContent>
					</Card>
				</section>
				<Separator />
				<header className="my-4 flex items-center justify-between gap-2">
					<Button variant="outline">
						<Calendar className="mr-2 h-4 w-4" />
						Jan 1, 2024 - Jan 31, 2024
					</Button>
					<Button>Download</Button>
				</header>
				<section className="grid grid-cols-4 gap-4">
					<DataCardFigure />
					<DataCardFigure />
					<DataCardFigure />
					<DataCardFigure />
					<DataCardAreaGraph />
					<DataCardLineGraph />
				</section>
			</section>
		</div>
	);
}

export default ProjectPage;
