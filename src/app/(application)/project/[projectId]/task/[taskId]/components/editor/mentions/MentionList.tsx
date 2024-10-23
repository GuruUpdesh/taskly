import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import "./mentionlist.css";
import { cn } from "~/lib/utils";

interface DropdownProps {
	items: string[];
	command: (payload: { id: string }) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MentionList = forwardRef((props: DropdownProps, ref: React.Ref<any>) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const selectItem = (index: number) => {
		const item = props.items[index];

		if (item) {
			props.command({ id: item });
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
							"flex w-full items-center gap-1 bg-transparent text-left",
							index === selectedIndex ? "bg-border" : "",
						)}
						key={index}
						onClick={() => selectItem(index)}
					>
						{item}
					</button>
				))
			) : (
				<div className="item">No result</div>
			)}
		</div>
	);
});

MentionList.displayName = "Dropdown";

export default MentionList;
