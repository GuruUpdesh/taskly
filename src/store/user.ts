import { create } from "zustand";

interface UserState {
	userId: string | null;
	setUserId: (userId: string) => void;
	aiUsageCount: number;
	setAiUsageCount: (count: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
	userId: null,
	setUserId: (userId) => set({ userId }),
	aiUsageCount: 0,
	setAiUsageCount: (aiUsageCount) => set({ aiUsageCount }),
}));
