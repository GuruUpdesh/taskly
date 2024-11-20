"use server";

import React from "react";

import { auth } from "@clerk/nextjs/server";
import { Users } from "lucide-react";

import { getAllProjects } from "~/actions/project-actions";
import SimpleTooltip from "~/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import InviteLinkWrapper from "~/features/invite/components/invite-link-wrapper";
import { throwServerError } from "~/utils/errors";

import ProjectList from "./ProjectList";

type Props = {
	currentProjectId: number;
};

async function ProjectListWrapper({ currentProjectId }: Props) {
	const { userId }: { userId: string | null } = await auth();
	if (!userId) return null;
	const projects = await getAllProjects(userId);
	if (!projects) {
		throwServerError("Error Loading Projects");
		return;
	}

	return (
		<ProjectList projects={projects}>
			<div>
				<Dialog>
					<DialogTrigger asChild>
						<div>
							<SimpleTooltip label="Share Project">
								<Button
									variant="ghost"
									size="icon"
									className="aspect-square h-[36px]"
								>
									<span className="sr-only">
										Share Project
									</span>
									<Users className="h-4 w-4" />
								</Button>
							</SimpleTooltip>
						</div>
					</DialogTrigger>
					<DialogContent>
						<h1 className="mb-8 text-3xl font-semibold">
							Invite Your Team
						</h1>
						<InviteLinkWrapper projectId={currentProjectId} />
					</DialogContent>
				</Dialog>
			</div>
		</ProjectList>
	);
}

export default ProjectListWrapper;
