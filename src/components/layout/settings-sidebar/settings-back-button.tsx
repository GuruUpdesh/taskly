"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const SettingsBackButton = () => {
	const router = useRouter();

	function handleback() {
		router.back();
	}
	return (
		<button
			onClick={handleback}
			className="flex items-center gap-4 text-2xl font-semibold tracking-tight"
		>
            <ArrowLeft />
			Settings
		</button>
	);
};

export default SettingsBackButton;
