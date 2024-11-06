"use client";

import React from "react";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";

import BubbleMenu from "~/features/text-editor/components/BubbleMenu";
import extensions from "~/features/text-editor/extensions";

import "~/features/text-editor/tiptap.css";

const ExampleTextEditor = () => {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			...extensions,
			Placeholder.configure({
				placeholder: "Add a description or type '/' for commands...",
			}),
		],
		content: ``,
	});
	return (
		<div className="max-h-[60vh] flex-1 overflow-scroll bg-red-800/25 p-4 rounded-lg">
			{editor && <BubbleMenu editor={editor} />}
			<EditorContent editor={editor} />
		</div>
	);
};

export default ExampleTextEditor;
