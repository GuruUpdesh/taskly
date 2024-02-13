"use client";

import React from "react";
import { Button } from "../ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";

type Props = {
	token: string;
};

function InviteLink({ token }: Props) {
	const link = window.location.host + "/join/" + token;
	const handleCopyToClipboard = async () => {
		await navigator.clipboard.writeText(link);
		toast.info("Copied to clipboard!");
	};
	return (
		<div className="flex items-center">
		  <Input
			value={link}
			onChange={(e) => {
			  e.preventDefault();
			}}
			className="flex-1 overflow-hidden whitespace-nowrap rounded-sm border p-2 text-muted-foreground"
		  />
		  <Button
			onClick={handleCopyToClipboard}
			className="gap-1 ml-2" // Added ml-2 for left margin
			type="button"
		  >
			<CopyIcon className="h-4 w-4" />
			Copy
		  </Button>
		</div>
	  );
	  
	  
}

export default InviteLink;
