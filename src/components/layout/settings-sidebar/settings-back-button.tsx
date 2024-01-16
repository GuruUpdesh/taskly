"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useSettingsNavigationStore } from "~/store/settingsNavigation";
import Link from "next/link";

const SettingsBackButton = () => {
	let backUrl = useSettingsNavigationStore((state) => state.backUrl);
	if (!backUrl) {
		backUrl = "/";
	}

	return (
		<Link
			href={backUrl}
			// onClick={handleback}
			className="flex items-center gap-4 text-2xl font-semibold tracking-tight"
		>
			<ArrowLeft />
			Settings
		</Link>
	);
};

export default SettingsBackButton;
