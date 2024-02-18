"use client";

import React, { useState } from "react";
import { Label } from "~/components/ui/label";
import { type Project } from "~/server/db/schema";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";
import { BlockPicker } from "react-color";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";

type Props = {
	project: Project;
	color: string;
};

const ProjectTheme = ({ project, color }: Props) => {
	const [currentColor, setCurrentColor] = useState<string>(color);

	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			{project.image ? (
				<Image
					src={project?.image}
					alt="Project Icon"
					width={56}
					height={56}
					className="rounded-full"
				/>
			) : (
				<Skeleton className="h-14 w-14 rounded-full border" />
			)}
			<Popover>
				<PopoverTrigger asChild>
					<Button
						style={{ backgroundColor: currentColor }}
						variant="outline"
					>
						Select Color
					</Button>
				</PopoverTrigger>
				<PopoverContent className="flex items-center justify-center border-none bg-transparent p-0 pt-3">
					<BlockPicker
						color={currentColor}
						onChangeComplete={(color) => setCurrentColor(color.hex)}
						colors={[
							"#ff7f50",
							"#87cefa",
							"#da70d6",
							"#32cd32",
							"#6495ed",
							"#ff69b4",
							"#ba55d3",
							"#cd5c5c",
							"#ffa500",
							"#40e0d0",
						]}
					/>
				</PopoverContent>
			</Popover>
			{project.image && (
				<>
					<Label htmlFor="projectName" className="font-bold">
						Icon
					</Label>
				</>
			)}
		</div>
	);
};

export default ProjectTheme;
