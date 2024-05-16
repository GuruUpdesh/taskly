"use client";

import React from "react";

import { ClipboardCopy, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type Props = {
	token: string;
};

function InviteLink({ token }: Props) {
	const link = window.location.host + "/join/" + encodeURIComponent(token);
	const handleCopyToClipboard = async () => {
		// get protocol
		const protocol = window.location.protocol;
		await navigator.clipboard.writeText(protocol + "//" + link);
		toast.info("Copied to clipboard!", {
			icon: <ClipboardCopy className="h-4 w-4" />,
		});
	};
	return (
		<div className="flex items-center">
			<Input
				value={link}
				onChange={(e) => {
					e.preventDefault();
				}}
				className="flex-1 overflow-hidden whitespace-nowrap rounded-sm border bg-background-dialog p-2 text-muted-foreground"
			/>
			<Button
				onClick={handleCopyToClipboard}
				className="ml-2 gap-1" // Added ml-2 for left margin
				type="button"
				variant="secondary"
				size="sm"
			>
				<CopyIcon className="mr-1 h-3 w-3" />
				Copy
			</Button>
		</div>
	);
}

export default InviteLink;
