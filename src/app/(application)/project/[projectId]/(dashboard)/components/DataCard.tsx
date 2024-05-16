"use client";

import React from "react";

import { format } from "date-fns";
import { Clock } from "lucide-react";
import {
	LineChart,
	Line,
	ResponsiveContainer,
	Area,
	XAxis,
	YAxis,
	Legend,
	Tooltip,
	ReferenceLine,
	ComposedChart,
} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

import GraphTooltip from "./GraphTooltip";

const DataCardLineGraph: React.FC<{
	data: { name: string; tasks: number; target: number; amt: number }[];
	title: string;
}> = (data) => {
	return (
		<Card className="col-span-4 bg-accent/50">
			<CardHeader className="pb-2">
				<CardDescription>{data.title}</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<LineChart data={data.data}>
						<XAxis dataKey="name" />
						<YAxis />
						<Legend />
						<Line
							type="monotone"
							dataKey="tasks"
							name="Tasks Completed"
							stroke="#8884d8"
							dot={false}
						/>
						<Line
							type="monotone"
							dataKey="target"
							name="Sprint Target"
							stroke="#992200"
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export type Result = {
	date: string;
	inProgress?: number;
	done?: number;
	points: number;
};

const DataCardAreaGraph: React.FC<{
	title: string;
	data: Result[];
}> = (props) => {
	const today = format(new Date(), "MMM d");
	const maxPoints = Math.max(...props.data.map((d) => d.points ?? 0));
	return (
		<Card className="col-span-4 bg-foreground/5">
			<CardHeader className="pb-2">
				<CardDescription className="flex items-center gap-2">
					<Clock className="h-4 w-4" />
					Current Sprint
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<ComposedChart
						width={500}
						height={400}
						data={props.data}
						margin={{
							top: 10,
							right: 30,
							left: 0,
							bottom: 0,
						}}
					>
						<defs>
							<linearGradient
								id="color-1"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={`#2cba2d`}
									stopOpacity={0.2}
								/>
								<stop
									offset="95%"
									stopColor={`#2cba2d`}
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient
								id="color-2"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={`#ffd500`}
									stopOpacity={0.2}
								/>
								<stop
									offset="95%"
									stopColor={`#ffd500`}
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<YAxis domain={[0, maxPoints]} hide />
						<XAxis dataKey="date" tickCount={5} interval={1} />
						<ReferenceLine x={today} stroke="#3c3c3c" />
						<Line
							strokeDasharray="8 8"
							dataKey="points"
							label="Points"
							stroke="#6f6f6f"
							dot={false}
							activeDot={false}
						/>
						<Area
							connectNulls
							type="linear"
							dataKey="points"
							stroke="transparent"
							fill="#242424"
						/>
						<Area
							connectNulls
							type="monotone"
							dataKey="inProgress"
							label="In Progress"
							stroke="#ffd500"
							fill="url(#color-2)"
						/>
						<Area
							connectNulls
							type="monotone"
							dataKey="done"
							label="Done"
							stroke="#2cba2d"
							fill="url(#color-1)"
						/>
						<Tooltip
							content={<GraphTooltip />}
							position={{ y: 0 }}
							animationDuration={0}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

const DataCardFigure: React.FC<{
	cardTitle: string;
	cardDescriptionUp: string;
	cardDescriptionDown: string;
}> = ({ cardTitle, cardDescriptionUp, cardDescriptionDown }) => {
	return (
		<Card className="bg-accent/50">
			<CardHeader className="pb-2">
				<CardDescription>{cardDescriptionUp}</CardDescription>
			</CardHeader>
			<CardContent>
				<CardTitle>{cardTitle}</CardTitle>
				<CardDescription>{cardDescriptionDown}</CardDescription>
			</CardContent>
		</Card>
	);
};

export { DataCardLineGraph, DataCardAreaGraph, DataCardFigure };
