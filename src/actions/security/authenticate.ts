import { auth } from "@clerk/nextjs/server";

export function authenticate() {
	const { userId } = auth();
	if (!userId) {
		throw new Error("User not authenticated");
	}

	return userId;
}
