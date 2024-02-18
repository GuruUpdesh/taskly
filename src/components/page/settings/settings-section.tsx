"use client";

import { useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { type SettingsConfig } from "~/config/settings-config";
import { cn } from "~/lib/utils";
import { useNavigationStore } from "~/store/navigation";
import typography from "~/styles/typography";

type Props = {
	anchor: string;
	title: SettingsConfig["title"];
	description: SettingsConfig["description"];
	icon: JSX.Element;
	children: React.ReactNode;
	className?: string;
};

const SettingsSection = ({
	anchor,
	title,
	description,
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
			className={cn("rounded-lg border p-4", className)}
			ref={sectionRef}
		>
			<header>
				<h2
					id={anchor}
					className={cn(
						typography.headers.h2,
						"mt-0 flex items-center gap-2",
					)}
				>
					{React.cloneElement(icon, { className: "w-5 h-5" })}
					{title}
				</h2>
				<p className={cn(typography.paragraph.p, "!mt-2")}>
					{description}
				</p>
			</header>
			<section className="mt-4">{children}</section>
		</div>
	);
};

export default SettingsSection;
