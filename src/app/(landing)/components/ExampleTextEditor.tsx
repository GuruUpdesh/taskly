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
		content: `
### Type '/' for commands...
- Highlight text to make it **bold** or *italic* or ~~<u>this</u>~~
- Embed [links](https://www.tasklypm.com/) and \`code\`
\`\`\`
// code blocks
function sortArray(arr) {
	return arr.sort((a, b) => a - b);
}
\`\`\`
		
- [x] Check lists
- [ ] And more!
		`,
	});
	return (
		<div className="max-h-[60vh] flex-1 overflow-scroll bg-red-800/25 p-4">
			<div className="mix-blend-overlay">
				{editor && <BubbleMenu editor={editor} />}
				<EditorContent editor={editor} />
			</div>
		</div>
	);
};

export default ExampleTextEditor;
