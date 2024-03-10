"use client";

import React from "react";

import { AppWindow, Book, MenuIcon, Plus, Video } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const MobileNav = () => {
	return (
		<Drawer>
			<DrawerTrigger className="block md:hidden">
				<Button
					variant="ghost"
					size="icon"
					className="flex justify-center"
				>
					<MenuIcon className="h-4 w-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<ul className="flex flex-col gap-1 p-8">
					<li>
						<Link
							href="/app"
							className={cn(
								typography.headers.h3,
								"flex w-full items-center gap-1 border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							<AppWindow className="h-4 w-4" />
							Application
						</Link>
					</li>
					<li>
						<Link
							href="/create-project"
							className={cn(
								typography.headers.h3,
								"flex w-full items-center gap-1 border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							<Plus className="h-4 w-4" />
							Create Project
						</Link>
					</li>
					<li>
						<Link
							href="/application"
							className={cn(
								typography.headers.h3,
								"flex w-full items-center gap-1 border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							<Video className="h-4 w-4" />
							Demo
						</Link>
					</li>
					<li>
						<Link
							href="https://docs.tasklypm.com"
							target="_blank"
							className={cn(
								typography.headers.h3,
								"flex w-full items-center gap-1 border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							<Book className="h-4 w-4" />
							Documentation
						</Link>
					</li>
				</ul>
			</DrawerContent>
		</Drawer>
	);
};

export default MobileNav;
