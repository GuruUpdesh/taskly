"use client";

import React from "react";

import {
	LineChart,
	Line,
	ResponsiveContainer,
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

const DataCardFigure: React.FC<{
	cardTitle: string;
	cardDescriptionUp: string;
	cardDescriptionDown: string;
}> = ({ cardTitle, cardDescriptionUp, cardDescriptionDown }) => {
	return (
		<Card className="col-span-2 bg-accent/50 lg:col-span-1">
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

export { DataCardLineGraph, DataCardFigure };
