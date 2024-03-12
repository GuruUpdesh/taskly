import React from "react";

import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUser } from "~/actions/user-actions";
import MobileNav from "~/components/layout/navbar/mobile-nav";
import Navbar, { RecentTaskMenuItem } from "~/components/layout/navbar/navbar";
import ProjectList from "~/components/layout/navbar/project-list";
import UserNav from "~/components/layout/navbar/user-nav";
import { RecentTasksNavWrapper } from "~/components/page/project/recent-tasks";

export default async function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = auth();
	if (userId) {
		const user = await getUser(userId);
		if (!user) {
			redirect("/waiting-room");
		}
	}

	return (
		<>
			<header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-lg @container">
				<div className="container flex h-16 max-w-[1400px] items-center justify-between py-4">
					<Link href="/" className="flex items-center gap-1">
						<Image
							src="/static/taskly-logo.png"
							alt="logo"
							height="38"
							width="100"
						/>
					</Link>
					<Navbar>
						<ProjectList />
						<RecentTaskMenuItem>
							<RecentTasksNavWrapper />
						</RecentTaskMenuItem>
					</Navbar>
					<div className="flex items-center gap-1">
						<UserNav />
						<MobileNav />
					</div>
				</div>
			</header>
			{children}
		</>
	);
}
