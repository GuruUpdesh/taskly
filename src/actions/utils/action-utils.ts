import { auth } from "@clerk/nextjs";

export function authenticate() {
	const { userId } = auth();
	if (!userId) {
		return null;
	}

	return userId;
}
