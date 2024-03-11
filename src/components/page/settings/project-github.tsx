import React from "react";

import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { getConnectedGithubRepo } from "~/actions/application/github-actions";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type Project } from "~/server/db/schema";
import typography from "~/styles/typography";

import GithubAppConnect from "./github-app-connect";

type Props = {
	project: Project;
};

const ProjectGithub = async ({ project }: Props) => {
	const user = await currentUser();
	const githubAccount = user?.externalAccounts.find(
		(account) => account.provider === "oauth_github",
	);
	const repos = await getConnectedGithubRepo(project.githubIntegrationId);
	return (
		<div>
			<p className={cn(typography.paragraph.p_muted)}>
				Automate workflows and keep everything synced
			</p>

			<div className="rounded border bg-accent/25 p-2 px-4">
				{githubAccount ? (
					<div className="flex items-center justify-between">
						<div className="flex items-center justify-start gap-1">
							<Image
								src={githubAccount.imageUrl}
								alt="GitHub account"
								width={30}
								height={30}
								className="rounded-full"
							/>
							<Link
								href={`https://github.com/${githubAccount.username}`}
								target="_blank"
							>
								<Button variant="link">
									{githubAccount.username}
								</Button>
							</Link>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-sm text-emerald-500">
								Connected
							</p>
							<Link href="/settings/profile">
								<Button variant="outline" size="sm">
									Configure
								</Button>
							</Link>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-between">
						<div className="flex items-center justify-start gap-2">
							<div className="h-[30px] w-[30px] rounded-full bg-accent"></div>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-sm text-red-500">
								Not Connected
							</p>
							<Link href="/settings/profile#/connected-account">
								<Button variant="outline" size="sm">
									Connect
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
			<div className="mt-4 flex items-center justify-between">
				<p className={cn(typography.paragraph.p_muted)}>
					Connected Repositories
				</p>
				<GithubAppConnect projectId={project.id} />
			</div>
			{repos && repos.length > 0 ? (
				<div className="mt-2 rounded border bg-accent/25 p-2 px-4">
					{repos.map((repo, idx) => (
						<div key={idx} className="flex items-center">
							<Image
								src={repo.owner.avatar_url}
								alt="Repository owner"
								width={30}
								height={30}
								className="rounded-md"
							/>
							<Link href={repo.html_url} target="_blank">
								<Button variant="link">{repo.full_name}</Button>
							</Link>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};

export default ProjectGithub;
