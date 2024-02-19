"use client";

import React from "react";
import { useAppStore } from "~/store/app";
import { motion } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const Filters = () => {
	const isFiltersOpen = useAppStore((state) => state.isFiltersOpen);

	// Define animation variants
	const variants = {
		open: { opacity: 1, height: "auto" },
		closed: { opacity: 0, height: 0 },
	};

	return (
		<motion.div
			initial="closed"
			animate={isFiltersOpen ? "open" : "closed"}
			variants={variants}
			transition={{ duration: 0.2, ease: [0.075, 0.82, 0.165, 1] }}
		>
			<div className="flex items-center gap-2 bg-gradient-to-b from-accent/25 to-transparent px-4 py-2 text-muted-foreground hover:text-white">
				<div className="grid-col-3 flex items-center justify-between gap-1 whitespace-nowrap rounded-full border bg-accent/25 px-4 py-1 text-sm transition-all hover:bg-accent">
					Status is Backlog
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<button className="rounded-full border bg-accent/25 p-1 transition-all hover:bg-accent">
							<Plus className="h-4 w-4" />
						</button>
					</PopoverTrigger>
					<PopoverContent className="overflow-hidden rounded-lg bg-background/75 p-0 backdrop-blur-xl">
						<form className="flex flex-col">
							<Select>
								<SelectTrigger className="max-w-[400px] rounded-none border-b border-l-0 border-r-0 border-t-0 bg-accent/25  focus:bg-accent/50">
									<SelectValue placeholder="Select Property" />
									<ChevronDown className="ml-2 h-4 w-4" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										value="1"
										className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
									>
										1 Week
									</SelectItem>
									<SelectItem
										value="2"
										className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
									>
										2 Weeks
									</SelectItem>
									<SelectItem
										value="3"
										className="flex items-center justify-between space-x-2 !pl-2  focus:bg-accent/50"
									>
										3 Weeks
									</SelectItem>
									<SelectItem
										value="4"
										className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
									>
										4 Weeks
									</SelectItem>
								</SelectContent>
							</Select>
							<div className="grid grid-flow-row grid-cols-2">
								<Button
									type="button"
									variant="outline"
									className="rounded-none border-b-0 border-l-0 border-r border-t-0 bg-accent/25 focus:bg-accent/50"
								>
									Is
								</Button>
								<Button
									type="button"
									variant="outline"
									className="rounded-none border-none bg-accent/25 focus:bg-accent/50"
								>
									Is not
								</Button>
							</div>
							<Select>
								<SelectTrigger className="max-w-[400px] rounded-none border-b-0 border-l-0 border-r-0 border-t bg-accent/25  focus:bg-accent/50">
									<SelectValue placeholder="Select Values" />
									<ChevronDown className="ml-2 h-4 w-4" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										value="1"
										className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
									>
										1 Week
									</SelectItem>
								</SelectContent>
							</Select>
							<Button
								type="button"
								variant="outline"
								className="rounded-none border-b-0 border-l-0 border-r-0 border-t bg-accent/25  focus:bg-accent/50"
							>
								Apply
							</Button>
						</form>
					</PopoverContent>
				</Popover>
			</div>
		</motion.div>
	);
};

export default Filters;
