import { type Editor, ReactRenderer } from "@tiptap/react";
import { type SuggestionOptions } from "@tiptap/suggestion";
import tippy, { type Instance } from "tippy.js";

import MentionList from "./MentionList";

interface MentionProps {
	editor: Editor;
	clientRect?: ClientRect | DOMRect;
	event?: KeyboardEvent;
	query?: string;
}

const mentionPlugin: SuggestionOptions = {
	items: ({ query }) => {
		return [
			"Lea Thompson",
			"Cyndi Lauper",
			"Tom Cruise",
			"Madonna",
			"Jerry Hall",
			"Joan Collins",
			"Winona Ryder",
			"Christina Applegate",
			"Alyssa Milano",
			"Molly Ringwald",
			"Ally Sheedy",
			"Debbie Harry",
			"Olivia Newton-John",
			"Elton John",
			"Michael J. Fox",
			"Axl Rose",
			"Emilio Estevez",
			"Ralph Macchio",
			"Rob Lowe",
			"Jennifer Grey",
			"Mickey Rourke",
			"John Cusack",
			"Matthew Broderick",
			"Justine Bateman",
			"Lisa Bonet",
		]
			.filter((item) =>
				item.toLowerCase().startsWith(query.toLowerCase()),
			)
			.slice(0, 5);
	},

	render: () => {
		let component: ReactRenderer | undefined;
		let popup: Instance[] | undefined;

		return {
			onStart: (props: MentionProps) => {
				component = new ReactRenderer(MentionList, {
					props,
					editor: props.editor,
				});

				if (!props.clientRect) {
					return;
				}

				popup = tippy("body", {
					getReferenceClientRect: props.clientRect,
					appendTo: () => document.body,
					content: component.element,
					showOnCreate: true,
					interactive: true,
					trigger: "manual",
					placement: "bottom-start",
				});
			},

			onUpdate: (props: MentionProps) => {
				if (!component) return;

				component.updateProps(props);

				if (!props.clientRect || !popup) {
					return;
				}

				popup[0].setProps({
					getReferenceClientRect: props.clientRect,
				});
			},

			onKeyDown: (props: MentionProps) => {
				if (props.event?.key === "Escape") {
					popup?.[0]?.hide();
					return true;
				}

				return component?.ref?.onKeyDown(props);
			},

			onExit: () => {
				if (popup) {
					popup[0].destroy();
				}
				component?.destroy();
			},
		};
	},
};

export default mentionPlugin;
