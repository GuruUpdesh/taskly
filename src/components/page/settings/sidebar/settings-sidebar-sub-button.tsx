"use client";

import { CornerDownRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { cn } from "~/lib/utils";
import { useNavigationStore } from "~/store/navigation";

type Props = {
	anchor: string;
	label: string;
	icon: JSX.Element;
};

const SettingsSidebarSubButton = ({ anchor, label, icon }: Props) => {
	const [active, setActive] = React.useState(false);

	const settingsOptions = useNavigationStore(
		(state) => state.settingsOptions,
	);

	useEffect(() => {
		if (!settingsOptions) return;
		const firstTrueKey = Object.keys(settingsOptions).find(
			(key) => settingsOptions[key] === true,
		);
		if (firstTrueKey === anchor) {
			setActive(true);
		} else {
			setActive(false);
		}
	}, [settingsOptions]);

	return (
		<Link href={"#" + anchor} className="group relative">
			<div
				className={cn(
					"absolute -left-4 bottom-[65%] h-[5000%] w-[2px] text-accent",
					active
						? "z-10 bg-accent opacity-100"
						: "bg-accent opacity-0 group-hover:opacity-75",
				)}
			>
				<CornerDownRight className="absolute -bottom-4 -left-[3px] text-accent" />
			</div>
			<button
				className={cn(
					"group flex w-full items-center justify-start gap-1 whitespace-nowrap px-2 py-2 text-muted-foreground hover:text-white",
					{ "text-white": active },
				)}
			>
				{React.cloneElement(icon, {
					className: "w-3.5 h-3.5 min-w-3.5",
				})}
				{label}
			</button>
		</Link>
	);
};

export default SettingsSidebarSubButton;
