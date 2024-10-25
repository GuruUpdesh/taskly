import { ReactRenderer } from "@tiptap/react";
import { type SuggestionOptions } from "@tiptap/suggestion";
import tippy, {
	type GetReferenceClientRect,
	type Instance,
	type Props as TippyProps,
} from "tippy.js";

import MentionList, { type MentionListRef } from "./MentionList";

// NOTE: this is the same as RenderCommandOptions
const RenderMentionOptions: SuggestionOptions["render"] = () => {
	let component: ReactRenderer<MentionListRef>;
	let popup: Instance<TippyProps> | undefined;

	return {
		onStart: (props) => {
			component = new ReactRenderer(MentionList, {
				props,
				editor: props.editor,
			});

			if (!props.clientRect) {
				return;
			}

			const bodyElement = document.querySelector(".tiptap");
			if (!bodyElement) return;

			popup = tippy(document.body, {
				getReferenceClientRect: () => {
					const rect = props.clientRect!();
					if (rect) {
						return rect;
					} else {
						return new DOMRect();
					}
				},
				appendTo: () => document.body,
				content: component.element,
				showOnCreate: true,
				interactive: true,
				trigger: "manual",
				placement: "bottom-start",
			});
		},

		onUpdate: (props) => {
			if (!component) return;

			component.updateProps(props);

			if (!popup || !props.clientRect) {
				return;
			}

			popup.setProps({
				getReferenceClientRect:
					props.clientRect as GetReferenceClientRect,
			});
		},

		onKeyDown: (props) => {
			if (props.event?.key === "Escape") {
				popup?.hide();
				return true;
			}

			if (component.ref) {
				return component.ref.onKeyDown(props);
			}

			return false;
		},

		onExit: () => {
			if (popup) {
				popup.destroy();
			}
			component?.destroy();
		},
	};
};

export default RenderMentionOptions;
