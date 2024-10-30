import { auth } from "@clerk/nextjs/server";

export async function authenticate() {
	const { userId } = await auth.protect();
	if (!userId) {
		throw new Error("User not authenticated");
	}

	return userId;
}
