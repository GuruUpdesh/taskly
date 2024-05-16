import React from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { format, formatDistanceToNow } from "date-fns";
import {
	ExternalLink,
	GitMerge,
	GitPullRequestArrow,
	GitPullRequestClosed,
} from "lucide-react";
import Link from "next/link";

import { type getPRStatusFromGithubRepo } from "~/actions/application/github-actions";
import SimpleTooltip from "~/app/components/SimpleTooltip";

type Props = {
	pullRequest: NonNullable<
		Awaited<ReturnType<typeof getPRStatusFromGithubRepo>>
	>[number];
};

const PullRequest = ({ pullRequest }: Props) => {
	function renderPullRequestState() {
		if (pullRequest.state === "open") {
			return (
				<div className="flex items-center gap-2 rounded-full border bg-accent px-3 py-1 text-sm">
					<GitPullRequestArrow className="h-4 w-4 text-[#238636]" />
					<span>Open</span>
				</div>
			);
		} else if (pullRequest.state === "closed") {
			return (
				<div className="flex items-center gap-2 rounded-full border bg-accent px-3 py-1 text-sm">
					<GitPullRequestClosed className="h-4 w-4 text-[#da3633]" />
					<span>Closed</span>
				</div>
			);
		} else {
			return (
				<div className="flex items-center gap-2 rounded-full border bg-accent px-3 py-1 text-sm">
					<GitMerge className="h-4 w-4 text-[#8957e5]" />
					<span>Merged</span>
				</div>
			);
		}
	}

	function renderPullRequestTime() {
		if (pullRequest.state === "open") {
			return (
				<SimpleTooltip
					label={format(
						new Date(pullRequest.updated_at),
						"MMM dd, yyyy, h:mm:ss aa",
					)}
				>
					<span className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground">
						{formatDistanceToNow(new Date(pullRequest.updated_at))}
					</span>
				</SimpleTooltip>
			);
		} else if (pullRequest.state === "closed" && pullRequest.closed_at) {
			return (
				<SimpleTooltip
					label={format(
						new Date(pullRequest.closed_at),
						"MMM dd, yyyy, h:mm:ss aa",
					)}
				>
					<span className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground">
						{formatDistanceToNow(new Date(pullRequest.closed_at))}
					</span>
				</SimpleTooltip>
			);
		} else if (pullRequest.merged_at) {
			return (
				<SimpleTooltip
					label={format(
						new Date(pullRequest.merged_at),
						"MMM dd, yyyy, h:mm:ss aa",
					)}
				>
					<span className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground">
						{formatDistanceToNow(new Date(pullRequest.merged_at))}
					</span>
				</SimpleTooltip>
			);
		}
		return null;
	}

	return (
		<Link
			href={pullRequest.html_url}
			target="_blank"
			className="group flex items-center justify-between overflow-hidden rounded border bg-accent/25 px-4 py-2 transition-all hover:bg-accent"
		>
			<div className="flex items-baseline gap-2">
				<GitHubLogoIcon className="h-4 w-4 translate-y-0.5" />
				<span>{pullRequest.title}</span>
				<span className="text-muted-foreground">
					#{pullRequest.number}
				</span>
			</div>
			<div className="flex items-center gap-2 transition-all">
				{renderPullRequestTime()}
				{renderPullRequestState()}
				<ExternalLink className="h-4 w-0 translate-y-10 opacity-0 transition-all group-hover:w-4 group-hover:translate-y-0 group-hover:opacity-100" />
			</div>
		</Link>
	);
};

export default PullRequest;
