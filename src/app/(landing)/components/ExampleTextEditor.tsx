"use client";

import React from "react";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";

import BubbleMenu from "~/features/text-editor/components/BubbleMenu";
import extensions from "~/features/text-editor/extensions";

import "~/features/text-editor/tiptap.css";

const content = `
### Type \`/\` for commands...
- Make text **bold** or *italic* or like ~~<u>this</u>~~.
- Embed [links](https://www.tasklypm.com/), \`code\`, quotes, and code blocks.
- Use shortcuts, collaborate, and get tasks finished.

### Try out
- [x] Check lists
- [x] @ Mentions
- [ ] and more...

All in Taskly's text editor.
		`;

const ExampleTextEditor = () => {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			...extensions,
			Placeholder.configure({
				placeholder: "Add a description or type '/' for commands...",
			}),
		],
		content: content,
	});
	return (
		<div className="max-h-[375px] flex-1 overflow-scroll bg-red-800/35 p-4">
			{editor && <BubbleMenu editor={editor} />}
			<EditorContent editor={editor} />
		</div>
	);
};

export default ExampleTextEditor;
