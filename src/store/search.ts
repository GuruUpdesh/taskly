import { create } from "zustand";

interface SearchState {
	backlogSearch: string;
	updateBacklogSearch: (newSearch: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
	backlogSearch: "",
	updateBacklogSearch: (newSearch) => set({ backlogSearch: newSearch }),
}));

export { useSearchStore };
