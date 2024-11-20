"use client";

import React from "react";

import { useShallow } from "zustand/react/shallow";

import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useCmdStore } from "~/store/cmd";

import "./cmdstyles.css";
import Commands from "./Commands";

const CommandMenu = () => {
	const commands = useCmdStore((state) => state.commands);
	const [open, setOpen] = useCmdStore(
		useShallow((state) => [state.menuOpen, state.setMenuOpen]),
	);

	// Toggle the menu when ⌘K is pressed
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(true);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="overflow-hidden bg-background p-0">
					<Commands
						commands={commands}
						selectCallback={() => setOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CommandMenu;
