"use client";

import React, { useEffect } from "react";

import { differenceInDays, format } from "date-fns";
import _ from "lodash";
import { Calendar } from "lucide-react";
import { TbHexagon } from "react-icons/tb";
import {
	Line,
	ResponsiveContainer,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ReferenceLine,
	ComposedChart,
} from "recharts";
import { type CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { type Sprint } from "~/server/db/schema";

import GraphTooltip from "./GraphTooltip";

export type Result = {
	date: string;
	inProgress?: number;
	done?: number;
	points: number;
};

interface DataPoint {
	date?: string;
	points?: number;
	inProgress?: number;
	done?: number;
}

const CurrentSprintAreaGraph: React.FC<{
	currentSprint: Sprint;
	data: Result[];
}> = (props) => {
	const today = format(new Date(), "MMM d");
	const maxPoints = Math.max(...props.data.map((d) => d.points ?? 0));

	const [tooltipData, setTooltipData] = React.useState<DataPoint>({});

	const handleTooltipChange = (data: CategoricalChartState) => {
		const payload = data.activePayload;
		if (!payload) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const itemPayload = payload[0].payload as DataPoint;
		if (itemPayload && !_.isEqual(itemPayload, tooltipData)) {
			setTooltipData(itemPayload);
		}
	};

	const handleMouseLeave = () => {
		const todayData =
			props.data.find((d) => d.date === format(new Date(), "MMM d")) ??
			({} as DataPoint);
		setTooltipData(todayData);
	};

	useEffect(() => {
		handleMouseLeave();
	}, []);

	return (
		<Card className="col-span-4 bg-foreground/5 2xl:col-span-2">
			<CardHeader className="pb-2">
				<CardTitle className="mb-2 flex items-center gap-2">
					Current Sprint
				</CardTitle>
				<CardDescription className="flex justify-between">
					<div className="flex items-center gap-1 text-sm">
						<p className="flex items-center gap-1 rounded-full bg-accent px-2">
							<Calendar className="h-3 w-3" />
							{format(
								props.currentSprint.startDate,
								"MMM d",
							)} - {format(props.currentSprint.endDate, "MMM d")}
						</p>
						<p className="ml-2 rounded-full bg-accent px-2">
							{differenceInDays(
								props.currentSprint.endDate,
								new Date(),
							)}{" "}
							days remaining
						</p>
					</div>
					<div className="flex items-center gap-1">
						{tooltipData.done !== undefined && (
							<p className="flex items-center gap-1 rounded-full bg-accent px-2 text-foreground">
								<span className="h-2 w-2 rounded-full bg-[#40A578]" />
								<span className="mr-1 text-muted-foreground">
									Done
								</span>
								<TbHexagon className="h-3 w-3" />
								{tooltipData.done}
							</p>
						)}
						{tooltipData.inProgress !== undefined && (
							<p className="flex items-center gap-1 rounded-full bg-accent px-2 text-foreground">
								<span className="h-2 w-2 rounded-full bg-[#E6FF94]" />
								<span className="mr-1 text-muted-foreground">
									Started
								</span>
								<TbHexagon className="h-3 w-3" />
								{tooltipData.inProgress}
							</p>
						)}
						<p className="flex items-center gap-1 rounded-full bg-accent px-2 text-foreground">
							<span className="h-2 w-2 rounded-full bg-[#6f6f6f]" />
							<span className="mr-1 text-muted-foreground">
								Total
							</span>
							<TbHexagon className="h-3 w-3" />
							{maxPoints}
						</p>
					</div>
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
						onMouseMove={(data) => handleTooltipChange(data)}
						onMouseLeave={handleMouseLeave}
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
									stopColor={`#40A578`}
									stopOpacity={0.2}
								/>
								<stop
									offset="95%"
									stopColor={`#40A578`}
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
									stopColor={`#E6FF94`}
									stopOpacity={0.2}
								/>
								<stop
									offset="95%"
									stopColor={`#E6FF94`}
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
							activeDot={false}
						/>
						<Area
							connectNulls
							type="monotone"
							dataKey="inProgress"
							stroke="#E6FF94"
							fill="url(#color-2)"
						/>
						<Area
							connectNulls
							type="monotone"
							dataKey="done"
							stroke="#40A578"
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

export default CurrentSprintAreaGraph;
