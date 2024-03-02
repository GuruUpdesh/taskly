import { toast } from "sonner";

import { env } from "~/env.mjs";

export function throwServerError(error: string) {
	throw new Error(error);
}

export function throwClientError(error: string) {
	if (env.NEXT_PUBLIC_NODE_ENV === "development") {
		toast.error("Error", {
			description: error,
		});
	} else {
		toast.error("Error", {
			description: "An error occurred. Please try again later.",
		});
	}
}
