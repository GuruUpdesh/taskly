"use client";

import { useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const globalToastSchema = z.object({
	message: z.string(),
	type: z.enum(["success", "error"]),
});

const GlobalToastHandler = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	function handleToast(query: unknown) {
		// validate the toast
		const result = globalToastSchema.safeParse(query);
		if (!result.success) {
			console.warn("Invalid toast query", result.error);
			return;
		}

		const toastQuery = result.data;

		// handle the toast
		switch (toastQuery.type) {
			case "success":
				console.log("GlobalToastHandler > success", toastQuery.message);
				toast.success(toastQuery.message);
				break;
			case "error":
				console.log("GlobalToastHandler > error", toastQuery.message);
				toast.error(toastQuery.message);
				break;
			default:
				toast(toastQuery.message);
		}

		// remove the toast from the search params
		const params = new URLSearchParams(searchParams.toString());
		params.delete("message");
		params.delete("type");
		router.push(pathname + "?" + params.toString());
	}

	useEffect(() => {
		const query = {
			message: searchParams.get("message"),
			type: searchParams.get("type"),
		};
		if (!query.message || !query.type) return;
		handleToast(query);
	}, [searchParams.toString()]);

	return null;
};

export default GlobalToastHandler;
