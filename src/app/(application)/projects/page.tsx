import { getAllProjects } from "~/app/(application)/projects/_actions/project-actions";
import ProjectTable from "~/app/(application)/projects/project-table";

export default async function ProjectsPage() {
	const projects = await getAllProjects();
	if (!projects) return null;

	return (
		<main className="bg-background">
			<div className="container flex flex-col gap-4 px-4 py-16 pt-24 ">
				<p className="text-sm text-muted-foreground">Create Project</p>
				<header className="flex items-center gap-2">
					<h3 className="scroll-m-20 text-2xl font-normal tracking-tight">
						Projects
					</h3>
					<p>{">"}</p>
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Create
					</h3>
				</header>
				<ProjectTable projects={projects} />
			</div>
		</main>
	);
}
