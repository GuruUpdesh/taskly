import { type ReactElement } from "react";

import { CodeIcon } from "@radix-ui/react-icons";
import { type Range, type Editor } from "@tiptap/react";
import {
	Heading1,
	Heading2,
	Heading3,
	List,
	ListChecks,
	ListOrdered,
	SquareSplitVertical,
	TextQuote,
} from "lucide-react";

export type Item = {
	title: string;
	icon: ReactElement;
	command: (props: { editor: Editor; range: Range }) => void;
};

const items: Item[] = [
	{
		title: "Heading 1",
		icon: <Heading1 className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 1 })
				.run();
		},
	},
	{
		title: "Heading 2",
		icon: <Heading2 className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 2 })
				.run();
		},
	},
	{
		title: "Heading 3",
		icon: <Heading3 className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor
				.chain()
				.focus()
				.deleteRange(range)
				.setNode("heading", { level: 3 })
				.run();
		},
	},
	{
		title: "Bullet List",
		icon: <List className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleBulletList().run();
		},
	},
	{
		title: "Ordered List",
		icon: <ListOrdered className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleOrderedList().run();
		},
	},
	{
		title: "Check List",
		icon: <ListChecks className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleTaskList().run();
		},
	},
	{
		title: "Code Block",
		icon: <CodeIcon />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
		},
	},
	{
		title: "Quote Block",
		icon: <TextQuote className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).toggleBlockquote().run();
		},
	},
	{
		title: "Divider",
		icon: <SquareSplitVertical className="h-4 w-4" />,
		command: ({ editor, range }) => {
			editor.chain().focus().deleteRange(range).setHorizontalRule().run();
		},
	},
];

const getSuggestionItems = (props: { editor: Editor; query: string }) => {
	return items
		.filter((item) =>
			item.title.toLowerCase().startsWith(props.query.toLowerCase()),
		)
		.slice(0, 10);
};

export default getSuggestionItems;
