"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

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
			<CardHeader>
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

const DataCardFigure: React.FC = () => {
	return (
		<Card>
			<CardHeader>
				<CardDescription>Totoal Taks</CardDescription>
			</CardHeader>
			<CardContent>
				<CardTitle>12</CardTitle>
				<CardDescription>+20.1% from last month</CardDescription>
			</CardContent>
		</Card>
	);
};

export { DataCardLineGraph, DataCardFigure };
