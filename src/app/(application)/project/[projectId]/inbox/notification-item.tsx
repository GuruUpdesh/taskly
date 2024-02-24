"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

import { Separator } from "~/components/ui/separator";

type Props = {
	id: string;
};

const NotificationItem = ({ id }: Props) => {
	const router = useRouter();
	const pathname = usePathname();

	// check if URL ends with Id
	const active = useMemo(() => {
		const path = pathname.split("/");
		return path[path.length - 1] === id;
	}, [id, pathname]);

	function handleClick() {
		if (active) return;

		// get path before inbox
		const path = pathname.split("inbox")[0];
		router.push(`${path}/inbox/notification/${id}`);
	}

	return (
		<>
			<div
				onClick={handleClick}
				className={cn(
					"cursor-pointer rounded-none p-2 hover:bg-accent",
					active && "bg-accent",
				)}
			>
				<div className="flex items-center justify-between">
					<p className="font-semibold">
						Implement User Authentication
					</p>
				</div>
				<div className="flex justify-between">
					<p className="text-muted-foreground">Asigned by Yash</p>
					<p className="text-muted-foreground">1 day ago</p>
				</div>
			</div>
			<Separator />
		</>
	);
};

export default NotificationItem;
