"use server";

import React from "react";

import { GearIcon } from "@radix-ui/react-icons";
import { and, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

import {
	cancelPendingIntegration,
	getConnectedGithubRepo,
} from "~/actions/application/github-actions";
import Message from "~/app/components/Message";
import SimpleTooltip from "~/app/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { db } from "~/server/db";
import { projectToIntegrations, type Project } from "~/server/db/schema";
import typography from "~/styles/typography";

import GithubAppConnect from "./GithubAppConnect";

type Props = {
	project: Project;
};

const ProjectGithub = async ({ project }: Props) => {
	const repos = await getConnectedGithubRepo(project.githubIntegrationId);
	const pendingIntegrations = await db
		.select()
		.from(projectToIntegrations)
		.where(
			and(
				eq(projectToIntegrations.projectId, project.id),
				eq(projectToIntegrations.integrationId, "github"),
			),
		);

	return (
		<div>
			<div className="mt-4 flex items-center justify-between">
				<p className={cn(typography.paragraph.p_muted)}>
					Connected Repositories
				</p>
				<GithubAppConnect projectId={project.id} />
			</div>
			{repos && repos.length > 0 ? (
				<div className="mt-2 rounded-md border bg-background-dialog p-2 px-4">
					{repos.map((repo, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between"
						>
							<div className="flex items-center">
								<Image
									src={repo.owner.avatar_url}
									alt="Repository owner"
									width={30}
									height={30}
									className="rounded-md"
								/>
								<Link href={repo.html_url} target="_blank">
									<Button variant="link">
										{repo.full_name}
									</Button>
								</Link>
							</div>
							<Link
								href={repo.html_url + "/settings/installations"}
								target="_blank"
							>
								<Button variant="secondary" size="sm">
									<GearIcon className="mr-1" />
									Configure
								</Button>
							</Link>
						</div>
					))}
				</div>
			) : (
				<Message type="faint" className="w-full">
					Connect to automate workflows and keep everything synced
				</Message>
			)}
			{pendingIntegrations.map((integration, idx) => (
				<form key={idx} action={cancelPendingIntegration}>
					<input
						hidden
						name="integrationId"
						value={integration.id}
					></input>
					<div className="mt-2 h-[58px] w-full rounded-md border bg-background-dialog p-2 px-4">
						<div className="flex items-center justify-between">
							<div className="flex h-[40px] items-center">
								<Skeleton className="h-8 w-8 rounded-md" />
								<Skeleton className="ml-2 h-4 w-20 rounded-md" />
							</div>
							<SimpleTooltip label="This integration is pending">
								<Button
									variant="secondary"
									size="sm"
									type="submit"
								>
									Cancel
								</Button>
							</SimpleTooltip>
						</div>
					</div>
				</form>
			))}
		</div>
	);
};

export default ProjectGithub;
