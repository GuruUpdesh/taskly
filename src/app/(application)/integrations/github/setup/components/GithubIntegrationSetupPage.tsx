"use client";

import React, { useEffect, useState } from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { stringifyError } from "next/dist/shared/lib/utils";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { resolvePendingIntegration } from "~/actions/application/github-actions";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const GithubIntegrationSetupPage = () => {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const installationId = searchParams.get("installation_id");

		if (installationId) {
			// Convert installationId to number before passing it
			resolvePendingIntegration(Number(installationId))
				.then(() => {
					setLoading(false);
				})
				.catch((error) => {
					setError(true);
					console.error(
						"Failed to resolve pending integration:",
						error,
					);
					toast.error("Failed to resolve pending integration", {
						description: stringifyError(error as Error),
					});
				});
		}
	}, [searchParams]);

	if (error) {
		return (
			<div className="min-w-screen flex min-h-screen items-center justify-center">
				<div className="p- flex flex-col items-center gap-2 rounded border bg-accent/25 p-4">
					<GitHubLogoIcon className="h-8 w-8" />
					<p className="flex items-center gap-2">
						GitHub Integration
						<b className="text-red-500">failed!</b>
					</p>
					<Button size="sm" onClick={() => window.close()}>
						Close
					</Button>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-w-screen flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center gap-2 rounded border bg-accent/25 p-4">
					<GitHubLogoIcon className="h-8 w-8" />
					<p className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						GitHub Integration is being set up...
					</p>
				</div>
			</div>
		);
	} else {
		return (
			<div className="min-w-screen flex min-h-screen items-center justify-center">
				<div className="p- flex flex-col items-center gap-2 rounded border bg-accent/25 p-4">
					<GitHubLogoIcon className="h-8 w-8" />
					<p className="flex items-center gap-2">
						GitHub Integration is{" "}
						<b className="text-emerald-500">complete</b>
					</p>
					<p className={cn(typography.paragraph.p_muted)}>
						You can now close this window and continue using the
						application.
					</p>
					<Button size="sm" onClick={() => window.close()}>
						Close
					</Button>
				</div>
			</div>
		);
	}
};

export default GithubIntegrationSetupPage;
