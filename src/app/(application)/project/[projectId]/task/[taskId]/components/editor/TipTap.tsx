"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "./tiptap.css";
import BubbleMenu from "./BubbleMenu";
import suggestion from "./mentions/suggestion";

type Props = {
	content: string;
	onChange: (content: string) => void;
};

const Tiptap = ({ content, onChange }: Props) => {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Highlight,
			Typography,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: "https",
			}),
			Placeholder.configure({
				placeholder: "Add a description...",
			}),
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Mention.configure({
				HTMLAttributes: {
					class: "mention",
				},
				suggestion,
			}),
		],
		content: JSON.parse(content) as string,
		onUpdate: (e) => {
			onChange(JSON.stringify(e.editor.getJSON()));
		},
	});

	return (
		<>
			{editor && <BubbleMenu editor={editor} />}
			<EditorContent editor={editor} />
		</>
	);
};

export default Tiptap;
