"use client";

import React from "react";

import {
	KBarPortal,
	KBarPositioner,
	KBarAnimator,
	KBarSearch,
	useMatches,
	KBarResults,
	type ActionImpl,
	type ActionId,
} from "kbar";

import { cn } from "~/lib/utils";

const searchStyle = {
	boxSizing: "border-box" as React.CSSProperties["boxSizing"],
};

const animatorStyle = {
	maxWidth: "600px",
	width: "100%",
	overflow: "hidden",
};

function KBar() {
	return (
		<KBarPortal>
			<KBarPositioner className="z-50">
				<KBarAnimator
					style={animatorStyle}
					className="rounded-lg bg-background-dialog ring-1 ring-border"
				>
					<KBarSearch
						style={searchStyle}
						className="w-full border-b bg-transparent p-4 text-muted-foreground outline-none"
					/>
					<div className="pt-2">
						<RenderResults />
					</div>
				</KBarAnimator>
			</KBarPositioner>
		</KBarPortal>
	);
}

function RenderResults() {
	const { results, rootActionId } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<div className="px-2 py-4 text-sm uppercase opacity-50">
						{item}
					</div>
				) : (
					<ResultItem
						action={item}
						active={active}
						currentRootActionId={rootActionId ?? ""}
					/>
				)
			}
		/>
	);
}

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
					"pointer mx-2 flex items-center justify-between gap-2 rounded bg-transparent p-2",
					{
						"bg-accent": active,
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

export default KBar;
