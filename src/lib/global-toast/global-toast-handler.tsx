"use client";

import type React from "react";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

type Props = {
	children: React.ReactNode;
};

export const globalToastSchema = z.object({
	message: z.string(),
	type: z.enum(["success", "error"]),
});

const GlobalToastHandler = ({ children }: Props) => {
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
				toast.success(toastQuery.message);
				break;
			case "error":
				toast.error(toastQuery.message);
				break;
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

	return children;
};

export default GlobalToastHandler;
