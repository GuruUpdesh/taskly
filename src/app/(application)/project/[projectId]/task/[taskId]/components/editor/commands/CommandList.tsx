import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";

import { cn } from "~/lib/utils";

import { type Item } from "./items";

interface DropdownProps {
	items: Item[];
	command: (payload: Item) => void;
}

export type CommandListRef = {
	onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

const CommandList = forwardRef(
	(props: DropdownProps, ref: React.Ref<CommandListRef>) => {
		const [selectedIndex, setSelectedIndex] = useState(0);

		const selectItem = (index: number) => {
			const item = props.items[index];

			if (item) {
				props.command(item);
			}
		};

		const upHandler = () => {
			setSelectedIndex(
				(selectedIndex + props.items.length - 1) % props.items.length,
			);
		};

		const downHandler = () => {
			setSelectedIndex((selectedIndex + 1) % props.items.length);
		};

		const enterHandler = () => {
			selectItem(selectedIndex);
		};

		useEffect(() => setSelectedIndex(0), [props.items]);

		useImperativeHandle(ref, () => ({
			onKeyDown: ({ event }: { event: KeyboardEvent }) => {
				if (event.key === "ArrowUp") {
					upHandler();
					return true;
				}

				if (event.key === "ArrowDown") {
					downHandler();
					return true;
				}

				if (event.key === "Enter") {
					enterHandler();
					return true;
				}

				return false;
			},
		}));

		return (
			<div className="relative flex flex-col overflow-auto rounded border bg-background p-2">
				{props.items.length ? (
					props.items.map((item, index) => (
						<button
							className={cn(
								"flex w-full items-center gap-2 rounded bg-transparent px-2 py-1 text-left",
								index === selectedIndex ? "bg-border" : "",
							)}
							key={index}
							onClick={() => selectItem(index)}
						>
							{item.icon}
							{item.title}
						</button>
					))
				) : (
					<div className="item">No result</div>
				)}
			</div>
		);
	},
);

CommandList.displayName = "CommandList";

export default CommandList;
