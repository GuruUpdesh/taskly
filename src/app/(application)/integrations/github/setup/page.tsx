"use client";
import React, { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { resolvePendingIntegration } from "~/actions/application/github-actions";

const Page = () => {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const installationId = searchParams.get("installation_id");

		if (installationId) {
			// Convert installationId to number before passing it
			resolvePendingIntegration(Number(installationId))
				.then(() => {
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					console.error(
						"Failed to resolve pending integration:",
						error,
					);
				});
		}
	}, [location]);

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return <div>Done</div>;
	}
};

export default Page;
