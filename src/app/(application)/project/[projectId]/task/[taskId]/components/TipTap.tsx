"use client";

import { useCallback, useState } from "react";

import {
	FontBoldIcon,
	FontItalicIcon,
	StrikethroughIcon,
	Link1Icon,
	LinkBreak1Icon,
	CodeIcon,
} from "@radix-ui/react-icons";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import {
	useEditor,
	EditorContent,
	FloatingMenu,
	BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./texteditor.css";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

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
			console.log(JSON.stringify(e.editor.getJSON()));
			onChange(JSON.stringify(e.editor.getJSON()));
		},
	});

	const [url, setUrl] = useState<string>("");

	const setLink = useCallback(() => {
		if (!editor) {
			return;
		}

		// empty
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		// update link
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	}, [editor, url]);

	const handleOpenPopover = useCallback(() => {
		if (editor) {
			const previousUrl = editor.getAttributes("link").href as string;
			setUrl(previousUrl || "");
		}
	}, [editor]);

	return (
		<>
			{editor && (
				<BubbleMenu
					className="bubble-menu flex rounded-sm border bg-background"
					tippyOptions={{ duration: 100 }}
					editor={editor}
				>
					<Button
						size="icon"
						variant="ghost"
						onClick={() =>
							editor.chain().focus().toggleBold().run()
						}
						className={cn(
							"rounded-none",
							editor.isActive("bold")
								? "bg-accent hover:bg-accent/75"
								: "text-muted-foreground",
						)}
					>
						<FontBoldIcon />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						onClick={() =>
							editor.chain().focus().toggleItalic().run()
						}
						className={cn(
							"rounded-none",
							editor.isActive("italic")
								? "bg-accent hover:bg-accent/75"
								: "text-muted-foreground",
						)}
					>
						<FontItalicIcon />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						onClick={() =>
							editor.chain().focus().toggleStrike().run()
						}
						className={cn(
							"rounded-none",
							editor.isActive("strike")
								? "bg-accent hover:bg-accent/75"
								: "text-muted-foreground",
						)}
					>
						<StrikethroughIcon />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						onClick={() =>
							editor.chain().focus().toggleCode().run()
						}
						className={cn(
							"rounded-none",
							editor.isActive("code")
								? "bg-accent hover:bg-accent/75"
								: "text-muted-foreground",
						)}
					>
						<CodeIcon />
					</Button>
					<Popover onOpenChange={handleOpenPopover}>
						<PopoverTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								className={cn(
									"rounded-none border-l",
									editor.isActive({ textAlign: "left" })
										? "bg-accent hover:bg-accent/75"
										: "text-muted-foreground",
								)}
							>
								<Link1Icon />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80 border-none p-0">
							<form
								className="flex w-full gap-2"
								onSubmit={(e) => {
									e.preventDefault();
									setLink();
								}}
							>
								<Input
									placeholder="URL"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									className=""
								/>
								<Button type="submit">Apply</Button>
							</form>
						</PopoverContent>
					</Popover>
					{editor.isActive("link") ? (
						<Button
							size="icon"
							variant="ghost"
							onClick={() =>
								editor.chain().focus().unsetLink().run()
							}
							className={cn(
								"rounded-none",
								editor.isActive({ textAlign: "left" })
									? "bg-accent hover:bg-accent/75"
									: "text-muted-foreground",
							)}
						>
							<LinkBreak1Icon />
						</Button>
					) : null}
				</BubbleMenu>
			)}

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
