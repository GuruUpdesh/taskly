"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";
import { PiWarning } from "react-icons/pi";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const ErrorPage = () => {
	const router = useRouter();
	useEffect(() => {
		const interval = setInterval(() => {
			location.reload();
		}, 250);

		return () => clearInterval(interval);
	}, [router]);

	return (
		<div className="min-w-screen flex min-h-screen items-center justify-center">
			<div className="p- flex flex-col items-center gap-2 rounded border bg-accent/25 p-4">
				<PiWarning className="h-8 w-8 text-red-500" />
				<p className="flex items-center gap-2 font-semibold text-red-500">
					An error occurred, please reload the page or sign out and
					try again.
				</p>
				<p className={cn(typography.paragraph.p_muted)}>
					If you continue to see this message, please contact support.
				</p>
				<Button
					size="sm"
					onClick={() => {
						document.cookie.split(";").forEach(function (c) {
							document.cookie =
								c.trim().split("=")[0] +
								"=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
						});
						sessionStorage.clear();
						localStorage.clear();
						router.push("/");
					}}
				>
					Sign Out
				</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
