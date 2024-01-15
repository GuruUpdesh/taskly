import React from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

export default function InboxPage() {
	return (
		<main className="flex h-full items-center justify-center pt-4">
			<div className="flex flex-col items-center justify-center">
				<EnvelopeClosedIcon className="h-24 w-24" />
				<h1 className="text-xl tracking-tight">
					You have no notifications
				</h1>
			</div>
		</main>
	);
}