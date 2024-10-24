"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import {
	useEditor,
	EditorContent,
	type Content,
	ReactRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap.css";
import tippy, {
	type GetReferenceClientRect,
	type Instance,
	type Props as TippyProps,
} from "tippy.js";

import { useRealtimeStore } from "~/store/realtime";

import BubbleMenu from "./BubbleMenu";
import MentionList, { type MentionListRef } from "./custom-menus/MentionList";

type Props = {
	content: string;
	onChange: (content: string) => void;
};

const Tiptap = ({ content, onChange }: Props) => {
	function getContent() {
		try {
			return JSON.parse(content) as Content;
		} catch (e) {
			return "";
		}
	}

	// TODO
	// TODO: implement this https://github.com/troop-dev/tiptap-react-render
	// we can  use this for SSR
	//
	//TODO
	const assignees = useRealtimeStore((state) => state.assignees);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Highlight,
			Typography,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: "https",
			}),
			Placeholder.configure({
				placeholder: "Add a description...",
			}),
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Mention.configure({
				HTMLAttributes: {
					class: "mention",
				},
				suggestion: {
					items: ({ query }) => {
						return assignees
							.filter((user) =>
								user.username
									.toLowerCase()
									.startsWith(query.toLowerCase()),
							)
							.slice(0, 5);
					},
					render: () => {
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

								const bodyElement =
									document.querySelector("body");
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
					},
				},
			}),
		],
		content: getContent(),
		onUpdate: (e) => {
			onChange(JSON.stringify(e.editor.getJSON()));
		},
	});

	return (
		<>
			{editor && <BubbleMenu editor={editor} />}
			<EditorContent editor={editor} />
		</>
	);
};

export default Tiptap;
