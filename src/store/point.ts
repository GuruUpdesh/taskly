import { create } from "zustand";

interface PointsState {
	totalPoints: Partial<Record<string, number>>;
	addPoints: (key: string, points: number) => void;
}

const usePointStore = create<PointsState>()((set) => ({
	totalPoints: {},
	addPoints: (key, points) =>
		set((state) => {
			const totalPoints = { ...state.totalPoints };
			totalPoints[key] = (totalPoints[key] ?? 0) + points;
			return { totalPoints };
		}),
}));

export { usePointStore };
