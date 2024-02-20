"use client";

import React, { forwardRef } from "react";
import {
	KBarProvider,
	KBarPortal,
	KBarPositioner,
	KBarAnimator,
	KBarSearch,
	useMatches,
	KBarResults,
	ActionImpl,
	ActionId,
} from "kbar";
import { Project, tasks } from "~/server/db/schema";
import { type Task } from "~/server/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TaskStatus } from "../page/project/recent-tasks";
import { cn } from "~/lib/utils";

type Props = {
	projectId: number;
};

function GlobalSearch({ projectId }: Props) {
	const queryClient = useQueryClient();
	const tasks = queryClient.getQueryData<Task[]>(["tasks"]) ?? [];

	const router = useRouter();

	const actions = tasks.map((task) => ({
		id: String(task.id),
		name: task.title,
		perform: () => router.push(`/project/${projectId}/task/${task.id}`),
	}));

	return (
		<KBarProvider
			actions={actions}
			options={{
				enableHistory: true,
			}}
		>
			<KBarPortal>
				<KBarPositioner>
					<KBarAnimator className="w-3/6 max-w-[600px] max-h-80 overflow-scroll rounded-lg border border-transparent bg-accent/25 p-2 shadow-xl backdrop-blur-xl relative">
						<div className="sticky top-0 z-10 py-3 px-2 border-b bg-[#0A1121] w-full">
							<KBarSearch className="w-full bg-transparent px-2 py-1 text-muted-foreground outline-none" />
						</div>
						<div className="overflow-y-auto max-h-80">
							<RenderResults tasks={tasks} />
						</div>
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
		</KBarProvider>
	);

}


type RenderResultsProps = {
	tasks: Task[];
};

function RenderResults({ tasks }: RenderResultsProps) {
	const { results, rootActionId } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<></>
				) : (
					<ResultItem
						action={item}
						active={active}
						currentRootActionId={rootActionId ?? ''}
					/>
				)
			}
		/>
	);
}
// <div className="flex items-center gap-2 rounded p-2 hover:bg-accent">
// 	<TaskStatus
// 		status={
// 			tasks.find(
// 				(task) => String(task.id) === item.id,
// 			)?.status ?? "backlog"
// 		}
// 	/>
// 	{item.name}
// </div>

type ResultItemProps = {
	action: ActionImpl;
	active: boolean;
	currentRootActionId: ActionId;
};

const ResultItem = React.forwardRef<HTMLDivElement, ResultItemProps>(
	({ action, active, currentRootActionId }, ref) => {
		const ancestors = React.useMemo(() => {
			if (!currentRootActionId) return action.ancestors;
			const index = action.ancestors.findIndex(
				(ancestor) => ancestor.id === currentRootActionId,
			);
			return action.ancestors.slice(index + 1);
		}, [action.ancestors, currentRootActionId]);
		// Your component code here
		return (
			<div
				ref={ref}
				className={cn(
					"pointer flex items-center justify-between gap-2 rounded p-2 hover:bg-accent",
					{
						"border-l-2 bg-accent": active,
					},
				)}
			>
				<div
					style={{
						display: "flex",
						gap: "8px",
						alignItems: "center",
						fontSize: 14,
					}}
				>
					{action.icon && action.icon}
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div>
							{ancestors.length > 0 &&
								ancestors.map((ancestor) => (
									<React.Fragment key={ancestor.id}>
										<span
											style={{
												opacity: 0.5,
												marginRight: 8,
											}}
										>
											{ancestor.name}
										</span>
										<span
											style={{
												marginRight: 8,
											}}
										>
											&rsaquo;
										</span>
									</React.Fragment>
								))}
							<span>{action.name}</span>
						</div>
						{action.subtitle && (
							<span style={{ fontSize: 12 }}>
								{action.subtitle}
							</span>
						)}
					</div>
				</div>
				{action.shortcut?.length ? (
					<div
						aria-hidden
						style={{
							display: "grid",
							gridAutoFlow: "column",
							gap: "4px",
						}}
					>
						{action.shortcut.map((sc) => (
							<kbd
								key={sc}
								style={{
									padding: "4px 6px",
									background: "rgba(0 0 0 / .1)",
									borderRadius: "4px",
									fontSize: 14,
								}}
							>
								{sc}
							</kbd>
						))}
					</div>
				) : null}
			</div>
		);
	},
);

ResultItem.displayName = "ResultItem";

export default GlobalSearch;
