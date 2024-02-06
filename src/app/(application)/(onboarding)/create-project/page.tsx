import ProjectCreateForm from "~/components/page/onboarding/create-project-form";
import { getAllProjects, initAction } from "~/actions/project-actions";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function createProjectPage() {
	await initAction();
	const user = auth();

	if (!user || !user.userId) {
		return null;
	}

	const projects = await getAllProjects(user.userId);

	if (!projects || projects.length === 0) {
		redirect("/onboarding");
	}

	return (
		<div className="flex justify-center">
			<div className="flex w-[600px] flex-col gap-4">
				<ProjectCreateForm />
				<div className="flex flex-col rounded-lg border bg-background/75 p-4 shadow-xl backdrop-blur-lg">
					<h1 className="mb-4 border-b pb-4 text-2xl tracking-tight">
						Your Current Projects
					</h1>
					<div className="flex flex-col gap-2">
						{projects.map((project) => (
							<Link
								key={project.id}
								className="flex justify-between hover:bg-accent/25"
								href={`/project/${project.id}/backlog`}
							>
								<p>{project.name}</p>
								<p>{project.id}</p>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
