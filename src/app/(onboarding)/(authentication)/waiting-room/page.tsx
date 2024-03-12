"use client";

import { useEffect } from "react";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemporaryPage() {
	const router = useRouter();

	// wait 2 seconds and then redirect to the home page
	useEffect(() => {
		setTimeout(() => {
			router.push("/");
		}, 2000);
	}, []);

	return <Loader2 className="h-6 w-6 animate-spin" />;
}
