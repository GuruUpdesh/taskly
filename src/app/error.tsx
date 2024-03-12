"use client";

import React from "react";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PiWarning } from "react-icons/pi";

import { Button } from "~/components/ui/button";

const ErrorPage = () => {
	const { signOut } = useClerk();
	const router = useRouter();
	return (
		<div className="min-w-screen flex min-h-screen items-center justify-center">
			<div className="p- flex flex-col items-center gap-2 rounded border bg-accent/25 p-4">
				<PiWarning className="h-8 w-8 text-red-500" />
				<p className="flex items-center gap-2 font-semibold text-red-500">
					An error occurred, please sign out and try again.
				</p>
				<Button
					size="sm"
					onClick={() => signOut(() => router.push("/"))}
				>
					Sign Out
				</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
