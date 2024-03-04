"use client";

import React, { type ForwardedRef } from "react";

import {
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
	markdownShortcutPlugin,
	MDXEditor,
	type MDXEditorMethods,
	type MDXEditorProps,
	linkPlugin,
	linkDialogPlugin,
} from "@mdxeditor/editor";
import "./texteditor.css";

export default function TextEditor({
	editorRef,
	...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
	return (
		<MDXEditor
			className="dark-theme dark-editor"
			plugins={[
				headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
				listsPlugin(),
				quotePlugin(),
				linkPlugin(),
				linkDialogPlugin(),
				thematicBreakPlugin(),
				markdownShortcutPlugin(),
			]}
			{...props}
			ref={editorRef}
		/>
	);
}
