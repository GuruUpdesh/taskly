"use client";

import React, { useRef } from "react";

import {
	ArrowUpIcon,
	Component1Icon,
	PersonIcon,
	PieChartIcon,
} from "@radix-ui/react-icons";
import { useInView } from "framer-motion";
import {
	CircleDashed,
	LayoutList,
	SparklesIcon,
	Minus,
	Feather,
	Loader2,
} from "lucide-react";
import Image from "next/image";
import { TbHexagon, TbHexagonNumber3 } from "react-icons/tb";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import UserProfilePicture from "~/components/UserProfilePicture";
import {
	type Color,
	taskVariants,
} from "~/features/tasks/config/taskConfigType";
import { cn } from "~/lib/utils";

type ButtonType = {
	icon: React.ReactNode;
	variant: "default" | "secondary";
	color?: Color;
	secondaryIcon?: React.ReactNode;
};

const buttons: ButtonType[] = [
	{
		icon: <SparklesIcon className="h-4 w-4" />,
		variant: "default",
		secondaryIcon: <Loader2 className="h-4 w-4 animate-spin" />,
	},
	{
		icon: <CircleDashed className="h-4 w-4" />,
		variant: "secondary",
		color: "yellow",
		secondaryIcon: <PieChartIcon className="h-4 w-4" />,
	},
	{
		icon: <TbHexagon className="h-4 w-4" />,
		variant: "secondary",
		secondaryIcon: <TbHexagonNumber3 className="h-4 w-4" />,
	},
	{
		icon: <Minus className="h-4 w-4" />,
		variant: "secondary",
		secondaryIcon: <ArrowUpIcon className="h-4 w-4" />,
		color: "orange",
	},
	{
		icon: <LayoutList className="h-4 w-4" />,
		variant: "secondary",
		secondaryIcon: <Feather className="h-4 w-4" />,
		color: "fuchsia",
	},
	{
		icon: <PersonIcon className="h-4 w-4" />,
		variant: "secondary",
		secondaryIcon: (
			<UserProfilePicture size={16} src={"/static/profiles/p2.png"} />
		),
	},
	{
		icon: <Component1Icon className="h-4 w-4" />,
		variant: "secondary",
		color: "green",
	},
];

const AiAutocompletePropertiesPanel = () => {
	const ref = useRef<HTMLDivElement>(null);

	const inView = useInView(ref, {});

	return (
		<div className="relative" ref={ref}>
			<div className="absolute top-[-1px] h-full w-full overflow-clip rounded-sm blur-3xl">
				<div className="absolute left-0 top-0 h-[200%] w-full">
					<Image
						fill
						src="/static/icon.png"
						alt=""
						className="animate-spin-slow"
					/>
				</div>
			</div>
			<Card
				className={cn(
					"group/card autocomplete-properties relative z-10 w-[600px] max-w-full overflow-hidden border-foreground/10 bg-background-dialog p-2 shadow-none",
					{ "autocomplete-properties-active": inView },
				)}
				style={{ animationDelay: "0.1s" }}
			>
				<CardHeader className="mb-4 p-0">
					<div className="flex items-center justify-between">
						<CardTitle className="text-md flex items-center gap-2">
							<span className="rounded bg-foreground/10 px-2 text-sm font-normal">
								Smart Properties
							</span>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="mb-2 p-0">
					<h1 className="text-lg">When creating a task...</h1>
					<Textarea
						placeholder="Add a description..."
						className="pointer-events-none h-[80px] resize-none border-none !bg-transparent p-0"
						readOnly
						value={
							"simply describe it and the properties will autofill!"
						}
					/>
					<div className="flex items-center gap-2 overflow-visible ">
						{buttons.map((button, index) => {
							return (
								<Button
									key={index}
									size="icon"
									variant={button.variant}
									className="relative min-w-[40px] overflow-hidden"
									style={
										{
											"--child-index": index,
										} as React.CSSProperties
									}
								>
									<div
										className={cn(
											"autocomplete-property absolute left-0 top-0 h-full w-full opacity-0",
											{
												"bg-[#262626]": index > 0,
												"bg-primary": index === 0,
											},
										)}
									>
										<div
											className={cn(
												"absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center !border-none",
												button.color
													? taskVariants({
															color: button.color,
														})
													: "",
											)}
										>
											{button.secondaryIcon ? (
												<>{button.secondaryIcon}</>
											) : (
												<>{button.icon}</>
											)}
										</div>
									</div>
									{button.icon}
								</Button>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default AiAutocompletePropertiesPanel;
