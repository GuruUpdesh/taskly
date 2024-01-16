"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigationStore } from "~/store/navigation";
import Link from "next/link";

const SettingsBackButton = () => {
	let lastApplicationPathname = useNavigationStore(
		(state) => state.lastApplicationPathname,
	);
	if (!lastApplicationPathname) {
		lastApplicationPathname = "/";
	}

	return (
		<Link
			href={lastApplicationPathname}
			// onClick={handleback}
			className="flex items-center gap-4 text-2xl font-semibold tracking-tight"
		>
			<ArrowLeft />
			Settings
		</Link>
	);
};

export default SettingsBackButton;
