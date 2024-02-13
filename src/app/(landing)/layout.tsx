import React from "react";
import Navbar from "~/components/layout/navbar/navbar";
import ProjectList from "~/components/layout/navbar/project-list";
import Image from "next/image";
import { ModeToggle } from "~/components/themes-switcher";
import Link from "next/link";
import UserNav from "~/components/layout/user-nav";
import AppNavMenu from "~/components/layout/navbar/app-nav-menu";
import RecentTasks from "~/components/page/project/recent-tasks";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<header className="sticky top-0 z-40 border-b bg-background @container">
				<div className="container flex h-16 items-center justify-between py-4">
					<Link href="/" className="flex items-center gap-1">
						<Image
							src="/static/taskly-logo.png"
							alt="logo"
							height="38"
							width="100"
						/>
					</Link>
					<Navbar>
						<AppNavMenu>
							<RecentTasks />
						</AppNavMenu>
						<ProjectList />
					</Navbar>
					<div className="flex items-center space-x-2">
						<ModeToggle />
						<UserNav />
					</div>
				</div>
			</header>
			{children}
		</>
	);
}
