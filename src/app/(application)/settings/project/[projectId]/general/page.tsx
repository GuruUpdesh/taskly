import { ArrowRightIcon } from "@radix-ui/react-icons";
import { format, isAfter, isBefore } from "date-fns";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAllUsersInProject, getProject } from "~/actions/project-actions";
import { getSprintsForProject } from "~/actions/sprint-actions";
import { authenticate } from "~/actions/utils/action-utils";
import Permission from "~/components/auth/Permission";
import EmailInviteWrapper from "~/components/invite/by-email/email-invite-wrapper";
import InviteLinkWrapper from "~/components/invite/invite-link-wrapper";
import AIToggle from "~/components/projects/ai-toggle";
import CreateSprintButton from "~/components/projects/create-sprint-button";
import DeleteProjectButton from "~/components/projects/delete-project-button";
import LeaveProjectButton from "~/components/projects/leave-project-button";
import SprintOptionsForm from "~/components/projects/sprint-options/sprint-options-form";
import UsersTable from "~/components/projects/users-table";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import constructToastURL from "~/lib/global-toast/global-toast-url-constructor";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";
import { throwClientError } from "~/utils/errors";
type Params = {
	params: {
		projectId: string;
	};
};

export default async function projectSettingsGeneral({
	params: { projectId },
}: Params) {
	const userId = authenticate();
	if (!userId) {
		redirect(constructToastURL("You are not authenticated!", "error"));
	}

	const projectResults = await getProject(Number(projectId));
	if (!projectResults?.success || !projectResults.project) {
		if (projectResults?.message) {
			redirect(constructToastURL(projectResults.message, "error"));
		}
		redirect(constructToastURL("Issue loading project", "error"));
	}
	const currentProject = projectResults.project;

	const sprints = await getSprintsForProject(Number(projectId));
	const users = await getAllUsersInProject(Number(projectId));

	if (!users) {
		throwClientError("Failed to get users in project");
		return null;
	}

	return (
		<div className="flex flex-col gap-8 p-6">
			<header>
				<h2 className={cn(typography.headers.h2, "pb-0")}>
					General Project Settings
				</h2>
				<p className={cn(typography.paragraph.p, "!mt-2")}>
					Here you manage the general settings for the project. This
					includes user permissions, project details, and more.
				</p>
			</header>
			<div className="rounded-lg border p-4">
				<h3 className={cn(typography.headers.h3, "")}>
					Project Information
				</h3>
				<p
					className={cn(
						typography.paragraph.p,
						"!mt-2 mb-4 text-muted-foreground",
					)}
				>
					General information about the project, make sure to save any
					changes.
				</p>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="projectName" className="font-bold">
						Project Name
					</Label>
					<Input
						type="text"
						id="projectName"
						className="mb-4"
						value={currentProject.name}
						disabled
					/>
					<Label htmlFor="projectDescription" className="font-bold">
						Project Description
					</Label>
					<Textarea
						id="projectDescription"
						placeholder="description"
						disabled
					/>
					<br />
					<AIToggle
						isChecked={currentProject.aiToggle}
						projectId={parseInt(projectId)}
					/>
				</div>
			</div>
			<div className="rounded-lg border p-4">
				<h3 className={cn(typography.headers.h3, "")}>Theme</h3>
				<p
					className={cn(
						typography.paragraph.p,
						"!mt-2 mb-4 text-muted-foreground",
					)}
				>
					Update the way your project looks and feels.
				</p>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					{currentProject.image && (
						<>
							<Label htmlFor="projectName" className="font-bold">
								Icon
							</Label>
							<Image
								src={currentProject?.image}
								alt="Project Icon"
								width={50}
								height={50}
								className="rounded-full border"
							/>
						</>
					)}
				</div>
			</div>
			<Permission
				projectId={currentProject?.id ?? -1}
				allowRoles={["owner", "admin"]}
			>
				<div className="rounded-lg border p-4">
					<h3 className={cn(typography.headers.h3)}>Users</h3>
					<div style={{ width: "95%" }}>
						<UsersTable
							users={users}
							projectId={currentProject?.id ?? -1}
							userId={userId}
						/>
					</div>
				</div>
				<div className="rounded-lg border p-4">
					<h3 className={cn(typography.headers.h3)}>Invite</h3>
					<div className="flex flex-col gap-4">
						<EmailInviteWrapper projectId={projectId} />
						<InviteLinkWrapper projectId={projectId} />
					</div>
				</div>
				<div className="flex flex-col rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<h3 className={cn(typography.headers.h3, "mb-4")}>
							Sprints
						</h3>
						<CreateSprintButton projectId={projectId} />
					</div>
					<p
						className={cn(
							typography.paragraph.p,
							"!mt-1 text-muted-foreground",
						)}
					>
						Sprints will be created automatically when your current
						sprint ends, or you can create one manually. Sprints are
						used to manage your project&apos;s workload and are a
						great way to keep your team on track.
					</p>
					<Separator className="my-8" />
					<Label className="font-bold">
						Current Sprints for Project
					</Label>
					<div className="mt-1.5 flex max-w-full flex-row flex-wrap items-center overflow-hidden rounded-xl border p-2">
						{sprints.map((sprint, idx) => {
							const active =
								isAfter(new Date(), sprint.startDate) &&
								isBefore(new Date(), sprint.endDate);
							return (
								<div
									key={sprint.id}
									style={{
										zIndex: sprints.length - idx,
									}}
									className={cn(
										"m-1 flex items-center justify-center gap-2 rounded-full border bg-background py-1 text-muted-foreground",
										active
											? "border-green-500 bg-background px-4 py-1.5 text-green-500 "
											: "",
										idx !== 0 ? "-ml-14 pl-16" : "pl-4",
									)}
								>
									{idx === 0 && (
										<p className="rounded-full bg-background/50 px-2 py-0.5 text-xs">
											{format(
												sprint.startDate,
												"MMM, dd",
											)}
										</p>
									)}
									<p>{sprint.name}</p>
									<p className="relative flex items-center px-2 py-0.5 text-xs">
										{format(sprint.endDate, "MMM, dd")}
										{active && (
											<ArrowRightIcon className="absolute -right-5 z-50 h-4 w-4 bg-background text-green-500" />
										)}
									</p>
								</div>
							);
						})}
					</div>
					<Separator className="my-8" />
					<Label className="font-bold">Sprint Options</Label>
					<p
						className={cn(
							typography.paragraph.p,
							"!mt-1 mb-4 text-muted-foreground",
						)}
					>
						Changes will automatically be applied when the next
						sprint starts.
					</p>
					<SprintOptionsForm project={currentProject} />
				</div>
			</Permission>
			<div className="rounded-lg border p-4">
				<h3 className={cn(typography.headers.h3)}>Danger Zone</h3>
				<div className="flex items-center gap-3">
					<Permission
						projectId={currentProject?.id ?? -1}
						allowRoles={["member", "admin"]}
					>
						<LeaveProjectButton
							projectName={
								currentProject ? currentProject.name : "error"
							}
							projectId={projectId}
						/>
					</Permission>
					<Permission
						projectId={currentProject?.id ?? -1}
						allowRoles={["owner"]}
					>
						<DeleteProjectButton
							projectName={
								currentProject ? currentProject.name : "error"
							}
							projectId={projectId}
						/>
					</Permission>
				</div>
			</div>
		</div>
	);
}
