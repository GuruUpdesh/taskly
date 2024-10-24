"use client";

import React, { useCallback, useState } from "react";

import {
	FontBoldIcon,
	FontItalicIcon,
	StrikethroughIcon,
	Link1Icon,
	LinkBreak1Icon,
	CodeIcon,
	LetterCaseToggleIcon,
	UnderlineIcon,
} from "@radix-ui/react-icons";
import { type Editor, BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import { List, ListChecks, ListOrdered } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

type Props = {
	editor: Editor;
};

const BubbleMenu = ({ editor }: Props) => {
	const [url, setUrl] = useState<string>("");

	const setLink = useCallback(() => {
		if (!editor) return;

		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	}, [editor, url]);

	const openLinkPopover = useCallback(() => {
		if (editor) {
			const previousUrl = editor.getAttributes("link").href as string;
			setUrl(previousUrl || "");
		}
	}, [editor]);

	const handleHeadingChange = useCallback(
		(headingLevel: "p" | "1" | "2" | "3") => {
			if (headingLevel !== "p") {
				editor
					.chain()
					.focus()
					.toggleHeading({
						level: parseInt(headingLevel) as 1 | 2 | 3,
					})
					.run();
			} else {
				editor.chain().focus().setParagraph().run();
			}
		},
		[editor],
	);

	const getActiveHeading = useCallback(() => {
		return editor.isActive("paragraph")
			? "p"
			: editor.isActive("heading", { level: 1 })
				? "1"
				: editor.isActive("heading", { level: 2 })
					? "2"
					: editor.isActive("heading", { level: 3 })
						? "3"
						: "";
	}, [editor]);

	const handleListChange = useCallback(
		(listType: "bullet-list" | "ordered-list" | "checklist") => {
			switch (listType) {
				case "bullet-list":
					editor.chain().focus().toggleBulletList().run();
					break;
				case "ordered-list":
					editor.chain().focus().toggleOrderedList().run();
					break;
				case "checklist":
					editor.chain().focus().toggleTaskList().run();
					break;
				default:
					break;
			}
		},
		[editor],
	);

	const getActiveList = useCallback(() => {
		return editor.isActive("bulletList")
			? "bullet-list"
			: editor.isActive("orderedList")
				? "ordered-list"
				: editor.isActive("taskList")
					? "checklist"
					: "";
	}, [editor]);

	return (
		<TipTapBubbleMenu
			className="bubble-menu flex rounded-sm border bg-background"
			tippyOptions={{ duration: 35 }}
			editor={editor}
		>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				onClick={() => editor.chain().focus().toggleBold().run()}
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
				type="button"
				size="icon"
				variant="ghost"
				onClick={() => editor.chain().focus().toggleItalic().run()}
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
				type="button"
				size="icon"
				variant="ghost"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className={cn(
					"rounded-none",
					editor.isActive("underline")
						? "bg-accent hover:bg-accent/75"
						: "text-muted-foreground",
				)}
			>
				<UnderlineIcon />
			</Button>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={cn(
					"rounded-none",
					editor.isActive("strike")
						? "bg-accent hover:bg-accent/75"
						: "text-muted-foreground",
				)}
			>
				<StrikethroughIcon />
			</Button>
			<Select
				value={getActiveHeading()}
				onValueChange={handleHeadingChange}
			>
				<SelectTrigger
					asChild
					className="w-min rounded border border-0 border-r bg-transparent"
				>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="flex gap-1 rounded-none text-sm font-normal text-muted-foreground"
					>
						<SelectValue placeholder={<LetterCaseToggleIcon />} />
					</Button>
				</SelectTrigger>
				<SelectContent
					portal={false}
					onCloseAutoFocus={(e) => e.preventDefault()}
				>
					<SelectItem value="p" className="text-sm">
						Regular text
					</SelectItem>
					<SelectItem value="1" className="text-xl">
						Heading 1
					</SelectItem>
					<SelectItem value="2" className="text-lg">
						Heading 2
					</SelectItem>
					<SelectItem value="3" className="text-md">
						Heading 3
					</SelectItem>
				</SelectContent>
			</Select>
			<Popover onOpenChange={openLinkPopover}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className={cn(
							"rounded-none",
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
							e.stopPropagation();
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
					type="button"
					size="icon"
					variant="ghost"
					onClick={() => editor.chain().focus().unsetLink().run()}
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
			<Button
				type="button"
				size="icon"
				variant="ghost"
				onClick={() => editor.chain().focus().toggleCode().run()}
				className={cn(
					"rounded-none",
					editor.isActive("code")
						? "bg-accent hover:bg-accent/75"
						: "text-muted-foreground",
				)}
			>
				<CodeIcon />
			</Button>
			<Select value={getActiveList()} onValueChange={handleListChange}>
				<SelectTrigger
					asChild
					className="w-min rounded border border-0 border-l bg-transparent"
				>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="flex gap-1 rounded-none text-sm font-normal text-muted-foreground"
					>
						<SelectValue
							placeholder={<List className="h-4 w-4" />}
							className="min-h-4 min-w-4"
						/>
					</Button>
				</SelectTrigger>
				<SelectContent
					portal={false}
					onCloseAutoFocus={(e) => e.preventDefault()}
				>
					<SelectItem value="bullet-list">
						<List className="h-4 w-4" />
					</SelectItem>
					<SelectItem value="ordered-list">
						<ListOrdered className="h-4 w-4" />
					</SelectItem>
					<SelectItem value="checklist">
						<ListChecks className="h-4 w-4" />
					</SelectItem>
				</SelectContent>
			</Select>
		</TipTapBubbleMenu>
	);
};

export default BubbleMenu;
