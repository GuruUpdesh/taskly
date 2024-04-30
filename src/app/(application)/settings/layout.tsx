import React from "react";

import { ArrowLeftIcon, Menu } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";

import SettingsSidebar from "~/app/(application)/settings/components/sidebar/SettingsSidebar";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

export const metadata: Metadata = {
	title: "Settings",
};

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col">
			<div className="sticky top-0 z-50 flex w-full items-center justify-between border-b bg-background-dialog px-4 py-2">
				<Link href="/app" prefetch>
					<Button
						variant="ghost"
						size="lg"
						className={
							"flex w-full items-center justify-start gap-5 rounded-none transition-all hover:gap-3"
						}
					>
						<ArrowLeftIcon className="h-5 min-w-5" />
						<span
							className={cn(typography.headers.h3, "border-none")}
						>
							Settings
						</span>
					</Button>
				</Link>
				<Sheet>
					<SheetTrigger className="block lg:hidden">
						<Button size="icon" variant="outline">
							<Menu size={24} />
						</Button>
					</SheetTrigger>
					<SheetContent className="bg-background-dialog px-0">
						<SettingsSidebar />
					</SheetContent>
				</Sheet>
			</div>
			<div className="fixed top-[61px] hidden h-full min-w-[250px] border-r bg-background-dialog lg:block">
				<div className="py-4">
					<SettingsSidebar />
				</div>
			</div>
			<div className="flex w-full justify-center lg:pl-[125px]">
				<div className="flex items-center justify-center overflow-scroll">
					<div className="max-w-[1000px]">{children}</div>
				</div>
			</div>
		</div>
	);
}
