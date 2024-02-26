import React from "react";

import { ArrowLeftIcon, PersonIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Link from "next/link";

import SidebarButton from "~/components/layout/sidebar/sidebar-button";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";
const ProjectSettings = dynamic(() => import("./project-settings"), {
	ssr: false,
});

const SettingsSidebar = () => {
	return (
		<div className="flex h-screen flex-col gap-4 bg-accent/25 @container">
			<Link href="/app" prefetch>
				<Button
					variant="ghost"
					size="lg"
					className={cn(
						"flex w-full items-center justify-start gap-5 rounded-none border-b py-8 transition-all hover:gap-3",
					)}
				>
					<ArrowLeftIcon className="h-5 min-w-5" />
					<span className={cn(typography.headers.h3, "border-none")}>
						Settings
					</span>
				</Button>
			</Link>
			<div className="px-4">
				<SidebarButton
					icon={<PersonIcon />}
					label="User Settings"
					url="/settings/profile"
				/>
			</div>
			<div className="px-4">
				<Separator className="mb-4" />
				<ProjectSettings />
			</div>
		</div>
	);
};

export default SettingsSidebar;
