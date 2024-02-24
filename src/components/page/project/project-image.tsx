"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import type { Project } from "~/server/db/schema";

type Props = {
	project: Project;
};

const ProjectImage = ({ project }: Props) => {
	const [imgSrc, setImgSrc] = useState(
		project.image ?? "/static/img-missing.jpg",
	);

	if (project.image) {
		return (
			<Image
				src={imgSrc}
				alt=""
				width={24}
				height={24}
				className="min-w-[24px] rounded-full mix-blend-screen"
				onError={(e) => {
					console.error("Error loading image", e);
					setImgSrc("/static/img-missing.jpg");
				}}
			/>
		);
	}
	return <Skeleton className="h-6 w-6 rounded-full" />;
};

export default ProjectImage;
