import React from "react";

import {
	ArrowUpIcon,
	Component1Icon,
	PersonIcon,
	PieChartIcon,
} from "@radix-ui/react-icons";
import {
	CircleDashed,
	LayoutList,
	SparklesIcon,
	Minus,
	Feather,
	Loader2,
	ChevronRight,
} from "lucide-react";
import { TbHexagon, TbHexagonNumber3 } from "react-icons/tb";

import UserProfilePicture from "~/app/components/UserProfilePicture";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { type Color, taskVariants } from "~/config/taskConfigType";
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
	return (
		<Card
			className="group/card fadeInUp autocomplete-properties relative overflow-hidden border-foreground/10 bg-accent/50 p-2 shadow-lg"
			style={{ animationDelay: "0.1s" }}
		>
			<CardContent className="px-2 py-1">
				<CardHeader className="mb-4 p-0">
					<div className="flex items-center justify-between">
						<CardTitle className="text-md flex items-center gap-2">
							<span className="rounded bg-foreground/10 px-2">
								Project
							</span>
							<ChevronRight className="h-4 w-4" />
							New Task
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="mb-2 p-0">
					<h1 className="text-lg opacity-50">Task Title</h1>
					<Textarea
						placeholder="Add a description..."
						className="pointer-events-none h-[80px] resize-none border-none !bg-transparent p-0"
						readOnly
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
			</CardContent>
		</Card>
	);
};

export default AiAutocompletePropertiesPanel;
