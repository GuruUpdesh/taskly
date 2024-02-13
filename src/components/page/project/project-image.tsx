"use client";

import Image from "next/image";
import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import type { Project } from "~/server/db/schema";

type Props = {
	project: Project;
};

const ProjectImage = ({ project }: Props) => {
	if (project.image) {
		return (
			<Image
				src={project.image}
				alt={project.name}
				width={24}
				height={24}
				className="min-w-[24px] rounded-full mix-blend-screen"
			/>
		);
	}
	return <Skeleton className="h-6 w-6 rounded-full" />;
};

export default ProjectImage;
