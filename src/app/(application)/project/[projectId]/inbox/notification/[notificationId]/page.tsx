import React from "react";

type Params = {
	params: {
		projectId: string;
		notificationId: string;
	};
};

export default function InboxPage({ params: { notificationId } }: Params) {
	return (
		<main className="flex h-full items-center justify-center pt-4">
			<div>
				<h1>Notifcation ID: {notificationId}</h1>
			</div>
		</main>
	);
}
