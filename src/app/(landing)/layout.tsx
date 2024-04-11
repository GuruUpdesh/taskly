import React from "react";

import Image from "next/image";
import Link from "next/link";

import MobileNav from "~/components/layout/navbar/mobile-nav";
import Navbar, { RecentTaskMenuItem } from "~/components/layout/navbar/navbar";
import ProjectList from "~/components/layout/navbar/project-list";
import UserNav from "~/components/layout/navbar/user-nav";
import { RecentTasksNavWrapper } from "~/components/page/project/recent-tasks";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-lg @container">
				<div className="container flex h-16 max-w-[1400px] items-center justify-between py-4">
					<div className="flex items-center gap-4">
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
					</div>
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
