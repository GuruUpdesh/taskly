"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CopyIcon } from "lucide-react";

type Props = {
	inviteLink: string;
};

function InviteLink({ inviteLink }: Props) {
	const link = window.location.host + "/join/" + inviteLink;
	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(link);
			alert("Copied to clipboard!");
		} catch (error) {
			console.error("Error copying to clipboard:", error);
		}
	};
	return (
		<div className="flex items-start">
			<Input value={link} />
			<Button onClick={handleCopyToClipboard} className="gap-1">
				<CopyIcon className="h-4 w-4" />
				Copy
			</Button>
		</div>
	);
}

export default InviteLink;
