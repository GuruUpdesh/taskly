"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { PiWarning } from "react-icons/pi";

import { Button } from "~/components/ui/button";

type Props = {
	error: Error & { digest?: string };
	reset: () => void;
};

const ErrorPage = ({ error, reset }: Props) => {
	const router = useRouter();

	return (
		<div className="min-w-screen flex min-h-screen items-center justify-center">
			<div className="p- flex max-w-[60ch] flex-col items-center gap-2 rounded border bg-accent/25 p-4">
				<PiWarning className="h-8 w-8 text-red-500" />
				<p className="flex items-center gap-2 font-semibold text-red-500">
					An unexpected error occurred
				</p>
				<p>Please reload the page or sign out and try again.</p>
				<p className="max-w-[60ch] rounded border bg-background/25 p-2 text-sm text-muted-foreground">
					{error.message}
				</p>
				<div className="flex items-center gap-4">
					<Button
						size="sm"
						variant="outline"
						className="bg-transparent"
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
					<Button
						size="sm"
						variant="secondary"
						onClick={() => reset()}
					>
						Try Again
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
