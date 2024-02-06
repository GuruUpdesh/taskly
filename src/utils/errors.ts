import { toast } from "sonner";
import { env } from "~/env.mjs";
import { type FailedAction } from "./action";

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

export function createError(message: string, error?: unknown): FailedAction {
	console.error(error);
	let description = "An error occurred. Please try again later.";
	if ((error as Error)?.message) {
		description = (error as Error).message;
	}

	return {
		status: "error",
		error: {
			message,
			description,
		},
	};
}
