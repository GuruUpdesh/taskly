import React from "react";

import { Sora } from "next/font/google";

import Logo from "~/components/general/logo";
import NavbarMenu, {
	RecentTaskMenuItem,
} from "~/components/layout/navbar/navbar-menu";
import ProjectList from "~/components/layout/navbar/project-list";
import UserNav from "~/components/layout/navbar/user-nav";
import { RecentTasksNavWrapper } from "~/components/page/project/recent-tasks";
import { cn } from "~/lib/utils";

const sora = Sora({ subsets: ["latin"] });

const Navbar = () => {
	return (
		<header
			className={cn(
				sora.className,
				"sticky top-0 z-40 flex justify-center",
			)}
		>
			<div className="container mt-4 flex h-12 max-w-[1400px] items-center justify-between rounded-full border border-foreground/10 px-2 shadow-lg backdrop-blur-2xl @container">
				<div className="px-2">
					<Logo />
				</div>
				<NavbarMenu>
					<ProjectList />
					<RecentTaskMenuItem>
						<RecentTasksNavWrapper />
					</RecentTaskMenuItem>
				</NavbarMenu>
				<UserNav />
			</div>
		</header>
	);
};

export default Navbar;
