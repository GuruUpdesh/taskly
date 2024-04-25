import React from "react";

import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { type Metadata } from "next";

export const metadata: Metadata = {
	title: "Inbox",
};

export default function InboxPage() {
	return (
		<main className="flex h-full items-center justify-center bg-background pt-4">
			<div className="flex flex-col items-center justify-center">
				<EnvelopeClosedIcon className="h-24 w-24" />
				<h1 className="text-xl tracking-tight">
					Select a notification
				</h1>
			</div>
		</main>
	);
}
