import React from "react";

import { format } from "date-fns";
import { GoGitPullRequest, GoGitPullRequestClosed } from "react-icons/go";
import { PiGitMergeDuotone } from "react-icons/pi";

import { type PRStatus } from "~/actions/application/github-actions";

import SimpleTooltip from "./SimpleTooltip";

type Props = {
	pr: PRStatus;
};
const TIMEFORMAT = "MMM dd, yyyy, h:mm:ss aa";

const GitHubPrState = ({ pr }: Props) => {
	if (pr.state === "open") {
		return (
			<SimpleTooltip
				label={
					pr.updated_at
						? format(new Date(pr.updated_at), TIMEFORMAT)
						: ""
				}
			>
				<div className="flex items-center text-sm">
					<GoGitPullRequest className="mr-2 text-[#238636]" />
					<span>Open</span>
				</div>
			</SimpleTooltip>
		);
	} else if (pr.state === "closed" && pr.merged) {
		return (
			<SimpleTooltip
				label={
					pr.merged_at
						? format(new Date(pr.merged_at), TIMEFORMAT)
						: ""
				}
			>
				<div className="flex items-center text-sm">
					<PiGitMergeDuotone className="mr-2 text-[#8957e5]" />
					<span>Merged</span>
				</div>
			</SimpleTooltip>
		);
	} else if (pr.state === "closed" && !pr.merged) {
		return (
			<SimpleTooltip
				label={
					pr.closed_at
						? format(new Date(pr.closed_at), TIMEFORMAT)
						: ""
				}
			>
				<div className="flex items-center text-sm">
					<GoGitPullRequestClosed className="mr-2 text-[#da3633]" />
					<span>Closed</span>
				</div>
			</SimpleTooltip>
		);
	}
	return null;
};

export default GitHubPrState;
