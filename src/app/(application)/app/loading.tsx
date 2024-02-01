import React from "react";
import { Loader2 } from "lucide-react";

export default function Redirecting() {
	return (
		<div className="flex h-screen items-center justify-center">
			<p className="flex items-center gap-2">
				<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				Redirecting
			</p>
		</div>
	);
}
