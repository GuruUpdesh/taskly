import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";

import UserProfilePicture from "~/app/components/UserProfilePicture";
import { cn } from "~/lib/utils";
import { type User } from "~/server/db/schema";

interface DropdownProps {
	items: User[];
	command: (payload: { id: string }) => void;
}

export type MentionListRef = {
	onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

const MentionList = forwardRef(
	(props: DropdownProps, ref: React.Ref<MentionListRef>) => {
		const [selectedIndex, setSelectedIndex] = useState(0);

		const selectItem = (index: number) => {
			const item = props.items[index];

			if (item) {
				props.command({ id: item.username });
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
							type="button"
							className={cn(
								"flex w-full items-center gap-2 rounded bg-transparent px-2 py-1 text-left",
								index === selectedIndex ? "bg-border" : "",
							)}
							key={index}
							onClick={() => selectItem(index)}
						>
							<UserProfilePicture src={item.profilePicture} />
							{item.username}
						</button>
					))
				) : (
					<div className="item">No result</div>
				)}
			</div>
		);
	},
);

MentionList.displayName = "MentionList";

export default MentionList;
