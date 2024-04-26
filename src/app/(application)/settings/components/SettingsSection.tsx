"use client";

import React, { useEffect, useRef } from "react";

import { useInView } from "framer-motion";

import { type settingsConfig } from "~/config/settingsConfig";
import { cn } from "~/lib/utils";
import { useNavigationStore } from "~/store/navigation";
import typography from "~/styles/typography";

type Props = {
	anchor: string;
	title: settingsConfig["title"];
	icon: JSX.Element;
	children: React.ReactNode;
	className?: string;
};

const SettingsSection = ({
	anchor,
	title,
	icon,
	children,
	className,
}: Props) => {
	const sectionRef = useRef<HTMLDivElement | null>(null);
	const updateSettingOption = useNavigationStore(
		(state) => state.updateSettingOption,
	);

	const isInView = useInView(sectionRef, {
		margin: "100px",
		amount: 1,
	});

	useEffect(() => {
		const handleScroll = () => {
			if (!sectionRef.current) return;
			const distance = sectionRef.current.getBoundingClientRect().top;
			if (isInView && distance >= -100) {
				updateSettingOption(anchor, true);
			} else {
				updateSettingOption(anchor, false);
			}
		};

		handleScroll();
		const scrollContainer = document.getElementById("scroll-container");
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener("scroll", handleScroll);
			}
		};
	}, [isInView, sectionRef.current]);

	return (
		<div
			className={cn(
				"w-[700px] rounded-lg border bg-accent/10",
				className,
			)}
			ref={sectionRef}
		>
			<header className="border-b p-4">
				<h3
					id={anchor}
					className={cn(
						typography.headers.h3,
						"mt-0 flex items-center gap-2 text-lg",
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
