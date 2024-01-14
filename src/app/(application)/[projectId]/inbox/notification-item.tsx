"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const NotificationItem = () => {
	const id = "test";

	const router = useRouter();
	const pathname = usePathname();

	// check if URL ends with Id
	const active = useMemo(() => {
		const path = pathname.split("/");
		return path[path.length - 1] === id;
	}, [id, pathname]);

	function handleClick() {
		if (active) return;

		router.push(`inbox/${id}`);
	}

	return (
		<Card
			onClick={handleClick}
			className={cn("p-2 hover:bg-accent", active && "bg-accent")}
		>
			<div className="flex items-center justify-between">
				<p className="font-semibold">Implement User Authentication</p>
				<Button
					className="rounded-full "
					variant="outline"
					size="iconSm"
				></Button>
			</div>
			<div className="flex justify-between">
				<p className="text-muted-foreground">Asigned by Yash</p>
				<p className="text-muted-foreground">1 day ago</p>
			</div>
		</Card>
	);
};

export default NotificationItem;
