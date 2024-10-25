import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import commands_extension from "~/features/text-editor/commands-extension";
import getSuggestionItems from "~/features/text-editor/components/items";
import RenderCommandOptions from "~/features/text-editor/components/RenderCommandOptions";

const extensions = [
	StarterKit,
	Typography,
	Link.configure({
		openOnClick: false,
		autolink: true,
		defaultProtocol: "https",
	}),
	TaskList,
	TaskItem.configure({
		nested: true,
	}),
	commands_extension.configure({
		suggestion: {
			items: getSuggestionItems,
			render: RenderCommandOptions,
		},
	}),
	Markdown.configure({
		transformPastedText: true,
		transformCopiedText: true,
	}),
	Underline,
];

export default extensions;
