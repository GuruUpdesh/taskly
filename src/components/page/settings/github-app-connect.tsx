"use client";

import React, { useState } from "react";

import { Loader2 } from "lucide-react";

import { addPendingIntegration } from "~/actions/application/project-actions";
import { Button } from "~/components/ui/button";

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
			variant="outline"
			size="sm"
			disabled={loading}
		>
			Connected Repository
			{loading && <Loader2 className="h-4 w-4 animate-spin" />}
		</Button>
	);
};

export default GithubAppConnect;
