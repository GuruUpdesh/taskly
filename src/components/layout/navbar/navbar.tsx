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
				"sticky top-0 z-40 flex justify-center border border-foreground/5 py-2 shadow-lg backdrop-blur-2xl",
			)}
		>
			<div className="container flex h-12 max-w-[1400px] items-center justify-between  @container">
				<Logo />
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
