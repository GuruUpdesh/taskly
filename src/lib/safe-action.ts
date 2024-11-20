import { toast } from "sonner";

import { logger } from "./logger";

export default async function safeAsync<T>(
	promise: Promise<T>,
): Promise<[T | null, Error | null]> {
	try {
		const data = await promise;
		return [data, null];
	} catch (error) {
		logger.error(error);
		if (error instanceof Error) {
			toast.error(error.message);
			return [null, error];
		}
		return [null, new Error("An unknown error occurred")];
	}
}
