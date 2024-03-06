"use client";

import React, { useMemo } from "react";
import { TbHexagon } from "react-icons/tb";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";
import typography from "~/styles/typography";

type Props = {
	listId: string;
};

const TotalPoints = ({ listId }: Props) => {
	const totalPointsObject = useAppStore((state) => state.totalPoints);
	const totalPoints = useMemo(() => {
		return totalPointsObject[listId];
	}, [totalPointsObject, listId]);

	if (!totalPoints) {
		return null;
	}

	return (
		<>
			<div className="flex-grow" />
			<div
				className={cn(
					"flex items-center gap-2",
					typography.paragraph.p_muted,
				)}
			>
				<TbHexagon className="h-4 w-4" />
				{totalPoints}
			</div>
		</>
	);
};

export default TotalPoints;
