import { type Sprint } from "~/server/db/schema";
interface SprintProgressCircleProps {
	progress: number;
	size?: number;
	strokeWidth?: number;
	className?: string;
}

export function SprintProgressCircle({
	progress,
	size = 16,
	strokeWidth = 2,
	className = "",
}: SprintProgressCircleProps) {
	// Calculate the circle's properties
	const center = size / 2;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - progress * circumference;

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			className={className}
		>
			{/* Background circle */}
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				opacity={0.2}
			/>
			{/* Progress circle */}
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={strokeDashoffset}
				transform={`rotate(-90 ${center} ${center})`}
			/>
		</svg>
	);
}

export function getSprintProgress(sprint: Sprint) {
	const now = new Date();
	const sprintDuration =
		sprint.endDate.getTime() - sprint.startDate.getTime();
	const elapsed = now.getTime() - sprint.startDate.getTime();
	return Math.min(Math.max(elapsed / sprintDuration, 0), 1); // Clamp between 0 and 1
}
