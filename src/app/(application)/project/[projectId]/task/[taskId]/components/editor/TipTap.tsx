"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { useEditor, EditorContent, type Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from 'tiptap-markdown';
import "./tiptap.css";

import { useRealtimeStore } from "~/store/realtime";

import BubbleMenu from "./BubbleMenu";
import commands from "./commands/commands";
import getSuggestionItems from "./commands/items";
import RenderCommandOptions from "./commands/RenderCommandOptions";
import RenderMentionOptions from "./mentions/RenderMentionOptions";

type Props = {
	content: string;
	onChange: (content: string) => void;
};

const Tiptap = ({ content, onChange }: Props) => {
	// TODO
	// TODO: implement this https://github.com/troop-dev/tiptap-react-render
	// we can  use this for SSR
	//TODO
	const assignees = useRealtimeStore((state) => state.assignees);

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
				suggestion: {
					items: ({ query }) => {
						return assignees
							.filter((user) =>
								user.username
									.toLowerCase()
									.startsWith(query.toLowerCase()),
							)
							.slice(0, 5);
					},
					render: RenderMentionOptions,
				},
			}),
			commands.configure({
				suggestion: {
					items: getSuggestionItems,
					render: RenderCommandOptions,
				},
			}),
			Markdown.configure({
				transformPastedText: true,
				transformCopiedText: true,
			})
		],
		content: content,
		onUpdate: (e) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			onChange(e.editor.storage.markdown.getMarkdown());
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
