"use client";

import React, { useRef } from "react";

import { type settingsConfig } from "~/config/settingsConfig";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

type Props = {
	title: settingsConfig["title"];
	icon: JSX.Element;
	children: React.ReactNode;
	className?: string;
};

const SettingsSection = ({ title, icon, children, className }: Props) => {
	const sectionRef = useRef<HTMLDivElement | null>(null);

	return (
		<div
			className={cn(
				"w-full flex-1 rounded-lg border bg-background-dialog/50",
				className,
			)}
			ref={sectionRef}
		>
			<header className="border-b p-4">
				<h3
					className={cn(
						typography.headers.h3,
						"text-md mt-0 flex items-center gap-2",
					)}
				>
					{React.cloneElement(icon, { className: "w-4 h-4" })}
					{title}
				</h3>
			</header>
			<section className="mt-4 p-4 pt-0">{children}</section>
		</div>
	);
};

export default SettingsSection;
