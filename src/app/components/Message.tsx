import React from "react";

import { type VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

import { cn } from "~/lib/utils";

const messageVariants = cva("rounded border backdrop-blur-xl", {
	variants: {
		type: {
			faint: "text-muted-foreground bg-muted/50",
			info: "text-blue-500 bg-blue-900/50 border-blue-900",
			error: "text-red-500 bg-red-900/50 border-red-900",
			success: "text-green-500 bg-green-900/50 border-green-900",
			warning: "text-yellow-500 bg-yellow-900/50 border-yellow-900",
		},
	},
	defaultVariants: {
		type: "faint",
	},
});

type Props = {
	type: VariantProps<typeof messageVariants>["type"];
	children: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
};

function Message({ type, children, description = null, className }: Props) {
	return (
		<div className="my-2 flex w-full justify-center">
			<div className={cn(messageVariants({ type }), className)}>
				<header className="flex items-center gap-2 p-2 leading-7">
					<MessageIcon type={type} />
					{children}
				</header>
				{description ? (
					<div className="mx-2 border-t  border-inherit">
						{description}
					</div>
				) : null}
			</div>
		</div>
	);
}

const MessageIcon = ({ type }: Pick<Props, "type">) => {
	switch (type) {
		case "faint":
			return <Info className="h-4 w-4" />;
		case "info":
			return <Info className="h-4 w-4" />;
		case "error":
			return <XCircle className="h-4 w-4" />;
		case "success":
			return <CheckCircle className="h-4 w-4" />;
		case "warning":
			return <AlertTriangle className="h-4 w-4" />;
	}
};

export default Message;
