"use client";
import React, { useEffect, useMemo, useState } from "react";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { isAfter, subHours } from "date-fns";

import SimpleTooltip from "~/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { type TaskToView } from "~/schema";
import { formatDateRelative, formatDateVerbose } from "~/utils/dateFormatters";

import TaskHistoryItem, { type TaskHistoryWithUser } from "../HistoryItem";

type Props = {
	taskHistory: TaskHistoryWithUser[];
	lastViewed: TaskToView[];
};

const TaskActivity = ({ taskHistory, lastViewed }: Props) => {
	const [showAllHistory, setShowAllHistory] = useState(false);
	const [lastViewedDate, setLastViewedDate] = useState<Date | null>(null);

	useEffect(() => {
		// When the component mounts, calculate the last viewed date
		if (lastViewed && lastViewed.length > 0) {
			const maxViewedAtDate = lastViewed.reduce((maxDate, task) => {
				return task.viewedAt > maxDate ? task.viewedAt : maxDate;
			}, lastViewed[0]?.viewedAt ?? new Date());

			// Only if there was a value to begin with will we actually accept the value
			if (lastViewed[0]?.viewedAt) {
				setLastViewedDate(maxViewedAtDate);
			}
		}
	}, []);

	// Create a sorted copy of the history array
	const sortedHistory = useMemo(
		() =>
			[...taskHistory].sort(
				(a, b) =>
					new Date(b.insertedDate).getTime() -
					new Date(a.insertedDate).getTime(),
			),
		[taskHistory],
	);

	// Determine which items to display based on lastViewedDate and showAllHistory
	const displayedHistory = useMemo(() => {
		if (lastViewedDate) {
			// Show only new activity if showAllHistory is false
			let filteredHistory = sortedHistory.filter((item) =>
				isAfter(new Date(item.insertedDate), lastViewedDate),
			);

			// Show latest history within the last hour if no new items
			if (filteredHistory.length < 1 && sortedHistory.length > 0) {
				const oneHourAgo = subHours(new Date(), 1);
				filteredHistory = sortedHistory.filter((item) =>
					isAfter(new Date(item.insertedDate), oneHourAgo),
				);

				// If still no items within last hour, show the most recent item
				if (filteredHistory.length === 0 && sortedHistory[0]) {
					filteredHistory = [sortedHistory[0]];
				}
			}

			return showAllHistory ? sortedHistory : filteredHistory;
		} else {
			// Fallback behavior
			return showAllHistory ? sortedHistory : sortedHistory.slice(0, 5);
		}
	}, [sortedHistory, lastViewedDate, showAllHistory]);

	return (
		<div className="py-4">
			<div className="flex flex-col gap-2 overflow-hidden">
				<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
					Activity
				</h3>
				{lastViewedDate && (
					<p className="text-sm text-muted-foreground">
						You last viewed at{" "}
						<SimpleTooltip
							label={formatDateVerbose(lastViewedDate)}
						>
							<span>{formatDateRelative(lastViewedDate)}</span>
						</SimpleTooltip>
					</p>
				)}
				<div className="flex flex-col gap-4 px-3">
					{displayedHistory.map((history) => (
						<TaskHistoryItem key={history.id} history={history} />
					))}
				</div>

				<div className="relative flex w-full justify-center">
					<span className="absolute top-[50%] z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
					<SimpleTooltip
						label={showAllHistory ? "Show Less" : "Show All"}
					>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setShowAllHistory(!showAllHistory)}
							className="z-10 rounded-xl bg-background-dialog p-1"
						>
							<span className="sr-only">
								{showAllHistory ? "Show Less" : "Show All"}
							</span>
							{showAllHistory ? (
								<ChevronDownIcon className="rotate-180" />
							) : (
								<ChevronDownIcon />
							)}
						</Button>
					</SimpleTooltip>
				</div>
			</div>
		</div>
	);
};

export default TaskActivity;
