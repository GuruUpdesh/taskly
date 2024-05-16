import { create } from "zustand";

interface LayoutState {
	rightSidebarWidth: number;
	setRightSidebarWidth: (width: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
	rightSidebarWidth: 0,
	setRightSidebarWidth: (width) => set({ rightSidebarWidth: width }),
}));
