"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap.css";
import BubbleMenu from "./BubbleMenu";

type Props = {
	content: string;
	onChange: (content: string) => void;
};

const Tiptap = ({ content, onChange }: Props) => {
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
		],
		content: JSON.parse(content) as string,
		onUpdate: (e) => {
			onChange(JSON.stringify(e.editor.getJSON()));
		},
	});

	return (
		<>
			{editor && <BubbleMenu editor={editor} />}

			{/* {editor && (
				<FloatingMenu
					className="floating-menu"
					tippyOptions={{ duration: 100 }}
					editor={editor}
				>
					<button
						onClick={() =>
							editor
								.chain()
								.focus()
								.toggleHeading({ level: 1 })
								.run()
						}
						className={
							editor.isActive("heading", { level: 1 })
								? "is-active"
								: ""
						}
					>
						H1
					</button>
					<button
						onClick={() =>
							editor
								.chain()
								.focus()
								.toggleHeading({ level: 2 })
								.run()
						}
						className={
							editor.isActive("heading", { level: 2 })
								? "is-active"
								: ""
						}
					>
						H2
					</button>
					<button
						onClick={() =>
							editor.chain().focus().toggleBulletList().run()
						}
						className={
							editor.isActive("bulletList") ? "is-active" : ""
						}
					>
						Bullet list
					</button>
				</FloatingMenu>
			)} */}
			<EditorContent editor={editor} />
		</>
	);
};

export default Tiptap;
