"use client";

import React, { useMemo } from "react";

import { GearIcon, PersonIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon, ChevronDown, FolderIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { useRealtimeStore } from "~/store/realtime";

const SettingsNavigation = () => {
	const router = useRouter();
	const pathname = usePathname();
	const project = useRealtimeStore((state) => state.project);

	const currentNav = useMemo(() => {
		if (pathname.includes("/settings/account")) return "account";
		return "project";
	}, [pathname]);

	if (!project) return null;

	return (
		<div
			className={cn(
				"flex w-full items-center justify-between transition-all duration-300 ease-out",
				{
					"max-w-[700px]": currentNav === "project",
					"max-w-[880px]": currentNav === "account",
				},
			)}
		>
			<Link href="/app" prefetch>
				<Button variant="ghost" className="flex items-center gap-2">
					<ArrowLeftIcon className="h-4 min-w-4" />
					Back
				</Button>
			</Link>
			<Button
				variant="ghost"
				size="sm"
				disabled
				className="h-8 text-muted-foreground !opacity-100"
			>
				<p className="flex items-center gap-1">
					<GearIcon className="h-4 w-4" />
					Settings
				</p>
			</Button>
			<div className="flex items-center gap-1">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8">
							<p className="flex items-center gap-1">
								{currentNav === "account" ? (
									<PersonIcon className="h-4 w-4" />
								) : (
									<FolderIcon className="h-4 w-4" />
								)}
								{currentNav === "account"
									? "Account"
									: "Project"}
								<ChevronDown className="h-4 w-4 opacity-50" />
							</p>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="bg-background/75 backdrop-blur-lg"
						onCloseAutoFocus={(e) => e.preventDefault()}
					>
						<DropdownMenuItem
							onSelect={() => router.push("/settings/account")}
						>
							<PersonIcon className="mr-1 h-4 w-4" />
							Account
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								router.push(
									`/settings/project/${project.id}/general`,
								)
							}
						>
							<FolderIcon className="mr-1 h-4 w-4" />
							Project
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default SettingsNavigation;
