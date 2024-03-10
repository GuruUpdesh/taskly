"use client";

import React from "react";

import { MenuIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const MobileNav = () => {
	return (
		<Sheet>
			<SheetTrigger asChild className="block md:hidden">
				<Button
					variant="ghost"
					size="icon"
					className="flex justify-center"
				>
					<MenuIcon className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<ul className="flex flex-col gap-1 ">
					<li>
						<Link
							href="/application"
							className={cn(
								typography.headers.h3,
								"border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							Application
						</Link>
					</li>
					<li>
						<Link
							href="/application"
							className={cn(
								typography.headers.h3,
								"border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							Create Project
						</Link>
					</li>
					<li>
						<Link
							href="/application"
							className={cn(
								typography.headers.h3,
								"border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							Demo
						</Link>
					</li>
					<li>
						<Link
							href="/application"
							className={cn(
								typography.headers.h3,
								"border-none p-0 py-0.5 font-semibold opacity-75 transition-opacity hover:underline hover:opacity-100",
							)}
						>
							Documentation
						</Link>
					</li>
				</ul>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNav;
