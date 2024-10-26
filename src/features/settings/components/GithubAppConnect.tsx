"use client";

import React, { useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { addPendingIntegration } from "~/features/github-integration/actions/add-pending-integration";

type Props = {
	projectId: number;
};

const GithubAppConnect = ({ projectId }: Props) => {
	const [loading, setLoading] = useState(false);
	async function openPopup() {
		setLoading(true);
		await addPendingIntegration(projectId, "github");
		setLoading(false);
		const url =
			"https://github.com/apps/tasklypm/installations/select_target";
		const windowName = "Install Taskly App";
		const windowSize = "width=800,height=800";

		window.open(url, windowName, windowSize);
	}
	return (
		<Button
			onClick={openPopup}
			variant="secondary"
			size="sm"
			disabled={loading}
		>
			Connect Repository
			{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
		</Button>
	);
};

export default GithubAppConnect;
