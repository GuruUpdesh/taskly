import { useEffect } from "react";

import { useShallow } from "zustand/react/shallow";

import { type Cmd, useCmdStore } from "~/store/cmd";

export function useRegisterCommands(commands: Cmd[], display = true) {
	const [addCommands, removeCommand] = useCmdStore(
		useShallow((state) => [state.addCommands, state.removeCommand]),
	);

	useEffect(() => {
		if (display) {
			addCommands(commands);
		} else {
			removeCommand(commands);
		}

		return () => {
			removeCommand(commands);
		};
	}, [addCommands, removeCommand, commands, display]);
}
