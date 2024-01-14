"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	LineChart,
	Line,
	ResponsiveContainer,
	AreaChart,
	Tooltip,
	Area,
} from "recharts";
import GraphTooltip from "./graph-tooltip";

const DataCardLineGraph: React.FC = () => {
	const data = [
		{ name: "Page A", uv: 400, pv: 2400, amt: 2400 },
		{ name: "Page B", uv: 800, pv: 2300, amt: 2100 },
		{ name: "Page C", uv: 600, pv: 2200, amt: 2000 },
		{ name: "Page D", uv: 700, pv: 2100, amt: 1900 },
		{ name: "Page E", uv: 500, pv: 2000, amt: 1800 },
		{ name: "Page F", uv: 900, pv: 1900, amt: 1700 },
		{ name: "Page G", uv: 300, pv: 1800, amt: 1600 },
	];
	return (
		<Card className="col-span-2">
			<CardHeader className="pb-2">
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<LineChart data={data}>
						<Line type="monotone" dataKey="uv" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

const DataCardAreaGraph: React.FC = () => {
	const data = [
		{ name: "Page A", uv: 400, pv: 2400, amt: 2400 },
		{ name: "Page B", uv: 800, pv: 2300, amt: 2100 },
		{ name: "Page C", uv: 600, pv: 2200, amt: 2000 },
		{ name: "Page D", uv: 700, pv: 2100, amt: 1900 },
		{ name: "Page E", uv: 500, pv: 2000, amt: 1800 },
		{ name: "Page F", uv: 900, pv: 1900, amt: 1700 },
		{ name: "Page G", uv: 300, pv: 1800, amt: 1600 },
	];
	return (
		<Card className="col-span-2">
			<CardHeader className="pb-2">
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<AreaChart
						width={500}
						height={400}
						data={data}
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
									stopColor={`#8884d8`}
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor={`#8884d8`}
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<Tooltip
							content={<GraphTooltip />}
							position={{ y: 0 }}
							animationDuration={0}
						/>
						<Area
							type="monotone"
							dataKey="uv"
							stroke="#8884d8"
							fill="url(#color-1)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

const DataCardFigure: React.FC = () => {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardDescription>Totoal Taks</CardDescription>
			</CardHeader>
			<CardContent>
				<CardTitle>12</CardTitle>
				<CardDescription>+20.1% from last month</CardDescription>
			</CardContent>
		</Card>
	);
};

export { DataCardLineGraph, DataCardAreaGraph, DataCardFigure };
