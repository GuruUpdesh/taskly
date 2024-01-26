"use client";

import React from "react";
import { Button } from "../ui/button";
import { CopyIcon } from "lucide-react";

type Props = {
	token: string;
};

function InviteLink({ token }: Props) {
	const link = window.location.host + "/join/" + token;
	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(link);
			alert("Copied to clipboard!");
		} catch (error) {
			console.error("Error copying to clipboard:", error);
		}
	};
	return (
		<div className="flex items-start gap-2">
			<p className="flex-1 rounded-sm border p-2">{link}</p>
			<Button onClick={handleCopyToClipboard} className="gap-1">
				<CopyIcon className="h-4 w-4" />
				Copy
			</Button>
		</div>
	);
}

export default InviteLink;
