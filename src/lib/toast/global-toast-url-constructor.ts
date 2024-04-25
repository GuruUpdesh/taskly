import type z from "zod";

import type { globalToastSchema } from "./global-toast-handler";

/**
 * Constructs a URL with query parameters for displaying a toast notification.
 *
 * @param {string} message - The message to be displayed in the toast notification.
 * @param {string} type - The type of the toast notification (e.g., "success", "error").
 * @param {string} [url] - The base URL to which the query parameters will be appended. If not provided, defaults to the current page's URL.
 * @returns {string} - The full URL with query parameters appended.
 */
function constructToastURL(
	message: string,
	type: z.infer<typeof globalToastSchema>["type"],
	url = "/",
) {
	const encodedMessage = encodeURIComponent(message);
	const encodedType = encodeURIComponent(type);

	const queryString = `?message=${encodedMessage}&type=${encodedType}`;

	return url ? `${url}${queryString}` : queryString;
}

export default constructToastURL;
