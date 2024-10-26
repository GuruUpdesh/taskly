import type React from "react";

import { create } from "zustand";

export type Cmd = {
	id: string;
	label: string;
	icon: React.ReactElement;
	priority: number; // the higher the number the higher the priority
	shortcut: string[];
	action: () => void;
	group?: string;
};

interface CmdState {
	menuOpen: boolean;
	setMenuOpen: (open: boolean) => void;
	commands: Cmd[];
	addCommands: (commands: Cmd[]) => void;
	removeCommand: (commands: Cmd[]) => void;
}

export const useCmdStore = create<CmdState>((set) => ({
	menuOpen: false,
	setMenuOpen: (menuOpen) => set({ menuOpen }),
	commands: [],
	addCommands: (commands) =>
		set((state) => {
			const commands_to_add = commands.filter(
				(c) => !state.commands.map((c) => c.id).includes(c.id),
			);
			return { commands: [...state.commands, ...commands_to_add] };
		}),
	removeCommand: (commands) =>
		set((state) => {
			const commands_to_remove = commands.map((c) => c.id);
			const new_commands = state.commands.filter(
				(cmd) => !commands_to_remove.includes(cmd.id),
			);

			return { commands: new_commands };
		}),
}));
