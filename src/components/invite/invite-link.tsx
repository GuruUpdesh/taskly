"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";

type Props = {
	token: string;
};

function InviteLink({ token }: Props) {
	const link = window.location.host + "/join/" + token;
	const handleCopyToClipboard = async () => {
		// get protocol
		const protocol = window.location.protocol;
		await navigator.clipboard.writeText(protocol + "//" + link);
		toast.info("Copied to clipboard!");
	};
	return (
		<div className="flex items-center">
			<Input
				value={link}
				onChange={(e) => {
					e.preventDefault();
				}}
				className="flex-1 overflow-hidden whitespace-nowrap rounded-sm border bg-accent/25 p-2 text-muted-foreground"
			/>
			<Button
				onClick={handleCopyToClipboard}
				className="ml-2 gap-1" // Added ml-2 for left margin
				type="button"
				variant="outline"
			>
				<CopyIcon className="h-4 w-4" />
				Copy
			</Button>
		</div>
	);
}

export default InviteLink;
