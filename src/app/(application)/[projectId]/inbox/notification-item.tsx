import { CheckCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const NotificationItem = () => {
	return (
		<Card className="p-2">
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
