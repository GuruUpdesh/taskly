import { Extension } from "@tiptap/core";
import { type Range, type Editor } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";

import { type Item } from "./items";

export default Extension.create({
	name: "commands",

	addOptions() {
		return {
			suggestion: {
				char: "/",
				command: ({
					editor,
					range,
					props,
				}: {
					editor: Editor;
					range: Range;
					props: Item;
				}) => {
					props.command({ editor, range });
				},
			},
		};
	},

	addProseMirrorPlugins() {
		return [
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			Suggestion({
				editor: this.editor,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				...this.options.suggestion,
			}),
		];
	},
});
