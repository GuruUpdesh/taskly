"use client";

import React, { ForwardedRef } from "react";
import {
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
	markdownShortcutPlugin,
	MDXEditor,
	type MDXEditorMethods,
	type MDXEditorProps,
} from "@mdxeditor/editor";

type Props = {};

export default function TextEditor({
	editorRef,
	...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
	return (
		<MDXEditor
			plugins={[
				headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
				listsPlugin(),
				quotePlugin(),
				thematicBreakPlugin(),
				markdownShortcutPlugin(),
			]}
			{...props}
			ref={editorRef}
		/>
	);
}
