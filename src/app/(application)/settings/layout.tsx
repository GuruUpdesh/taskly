import React from "react";

import { type Metadata } from "next";

import SettingsNavigation from "./components/SettingsNavigation";

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
			<div className="sticky top-0 z-50 flex w-full justify-center border-b bg-accent/25 px-4 py-2 backdrop-blur-lg backdrop-brightness-50">
				<SettingsNavigation />
			</div>
			<div className="flex w-full justify-center">
				<div className="flex items-center justify-center overflow-scroll">
					{children}
				</div>
			</div>
		</div>
	);
}
