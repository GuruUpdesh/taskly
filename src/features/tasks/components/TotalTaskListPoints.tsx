"use client";

import React, { useMemo } from "react";

import { TbHexagon } from "react-icons/tb";

import { cn } from "~/lib/utils";
import { usePointStore } from "~/store/point";
import typography from "~/styles/typography";

type Props = {
	listId: string;
};

const TotalTaskListPoints = ({ listId }: Props) => {
	const totalPointsObject = usePointStore((state) => state.totalPoints);

	const totalPoints = useMemo(() => {
		return totalPointsObject[listId];
	}, [totalPointsObject, listId]);

	if (!totalPoints) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex items-center gap-1",
				typography.paragraph.p_muted,
			)}
		>
			<p>{totalPoints}</p>
			<TbHexagon className="h-4 w-4" />
		</div>
	);
};

export default TotalTaskListPoints;
