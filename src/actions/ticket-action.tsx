"use server";

import { env } from "~/env.mjs";

export async function createTicket(title: string, body: string) {
	const accessToken = env.ACCESS_TOKEN;
	const owner = "GuruUpdesh";
	const repo = "taskly";

	const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

	if ((!title && !body) || !title || !body) {
		return false;
	}

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `token ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title, body }),
	});

	if (response.ok) {
		return true;
	} else {
		return false;
	}
}
