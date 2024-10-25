import { forwardRef } from "react";

import { CrossCircledIcon } from "@radix-ui/react-icons";

import { cn } from "~/lib/utils";

const Chip = forwardRef<
	HTMLDivElement,
	{
		children: string;
		onClick: () => void;
		keyDown: (e: React.KeyboardEvent) => void;
		onBlur: () => void;
		isFocused: boolean;
	}
>(function Chip({ children, onClick, keyDown, onBlur, isFocused }, ref) {
	return (
		<div
			ref={ref}
			onClick={onClick}
			className={cn(
				"relative flex cursor-pointer items-center gap-2 rounded-full border bg-background px-3 py-0.5 pr-8 hover:bg-accent/50",
				isFocused && "ring ring-accent/50",
			)}
			onKeyDown={keyDown}
			onBlur={onBlur}
			tabIndex={-1}
		>
			{children}
			<CrossCircledIcon className="absolute right-2 top-0 aspect-square h-full" />
		</div>
	);
});

export default Chip;
