import React from "react";

function BlockedPage() {
	return (
		<div className="min-w-screen flex min-h-screen items-center justify-center">
			<div className="flex flex-col rounded-lg border bg-background-dialog p-4">
				<div className="mb-2 flex items-center gap-2 text-2xl">
					<h2>You are making to many requests</h2>
				</div>
				<p className="opacity-75">
					Please wait a few seconds before trying again.
				</p>
			</div>
		</div>
	);
}

export default BlockedPage;
