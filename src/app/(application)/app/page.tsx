"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "~/store/navigation";

export default function RedirectPage() {
	const lastApplicationPathname = useNavigationStore(
		(state) => state.lastApplicationPathname,
	);

	const router = useRouter();

	React.useEffect(() => {
		if (!lastApplicationPathname) {
			router.push("/");
			return;
		}
		router.push(lastApplicationPathname);
	}, [lastApplicationPathname]);

	return (
		<div className="flex h-screen items-center justify-center">
			<p className="flex items-center gap-2">
				<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				Redirecting
			</p>
		</div>
	);
}
