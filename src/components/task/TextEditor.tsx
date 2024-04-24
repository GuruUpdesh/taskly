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
	toolbarPlugin,
	UndoRedo,
	BoldItalicUnderlineToggles,
	CodeToggle,
	CreateLink,
	InsertThematicBreak,
	ListsToggle,
} from "@mdxeditor/editor";

import "./texteditor.css";
import { Separator } from "../ui/separator";

export default function TextEditor({
	editorRef,
	...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
	return (
		<MDXEditor
			className="dark-theme dark-editor"
			placeholder="Add a description..."
			plugins={[
				headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
				listsPlugin(),
				quotePlugin(),
				linkPlugin(),
				linkDialogPlugin(),
				thematicBreakPlugin(),
				markdownShortcutPlugin(),
				toolbarPlugin({
					toolbarContents: () => (
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<UndoRedo />
								<Separator
									orientation="vertical"
									className="h-[32px] bg-foreground/10"
								/>
								<BoldItalicUnderlineToggles />
								<Separator
									orientation="vertical"
									className="h-[32px] bg-foreground/10"
								/>
								<div className="flex items-center">
									<CodeToggle />
									<CreateLink />
									<InsertThematicBreak />
								</div>
							</div>
							<ListsToggle />
						</div>
					),
				}),
			]}
			{...props}
			ref={editorRef}
		/>
	);
}
