"use client";

import React from "react";

import {
	LineChart,
	Line,
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Legend,
} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

const DataCardLineGraph: React.FC<{
	data: { name: string; tasks: number; target: number; amt: number }[];
	title: string;
}> = (data) => {
	return (
		<Card className="col-span-4">
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

const DataCardAreaGraph: React.FC<{
	title: string;
	data: {
		name: string;
		uv: number;
		pv: number;
		amt: number;
	}[];
}> = (props) => {
	return (
		<Card className="col-span-2">
			<CardHeader className="pb-2">
				<CardDescription>{props.title}</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<AreaChart
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
						<XAxis dataKey="name" />
						<YAxis />
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

const DataCardFigure: React.FC<{
	cardTitle: string;
	cardDescriptionUp: string;
	cardDescriptionDown: string;
}> = ({ cardTitle, cardDescriptionUp, cardDescriptionDown }) => {
	return (
		<Card>
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
