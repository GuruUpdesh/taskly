"use client";

import React from "react";

import { Button } from "~/components/ui/button";

const GithubAppConnect = () => {
	function openPopup() {
		const url =
			"https://github.com/apps/tasklypm/installations/select_target";
		const windowName = "Install Taskly App";
		const windowSize = "width=800,height=800";

		window.open(url, windowName, windowSize);
	}
	return (
		<Button onClick={openPopup} variant="outline" size="sm">
			Connected Repository
		</Button>
	);
};

export default GithubAppConnect;
