import { getProject } from "~/app/(application)/projects/_actions/project-actions";
import { env } from "~/env.mjs";
import { getAllTasks } from "../../tasks/_actions/task-actions";
import TaskTable from "../../tasks/table/task-table";

type Params = {
	params: {
		projectId: string;
	};
};

export default async function ProjectsCreatePage({
	params: { projectId },
}: Params) {
	const project = await getProject(parseInt(projectId));

	if (project === undefined)
		return <p>project with id {projectId} doesnt exist</p>;

	const tasks = await getAllTasks();
	if (tasks === undefined) return null;

	return (
		<div className="container flex flex-col gap-4 px-4 py-16 pt-24 ">
			<p className="text-sm text-muted-foreground">
				{env.NODE_ENV.toLocaleUpperCase()} / Projects / {project.name}
			</p>
			<header className="flex items-center gap-2">
				<h3 className="scroll-m-20 text-2xl font-normal tracking-tight">
					{project.name}
				</h3>
				<p>{">"}</p>
				<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
					Backlog
				</h3>
			</header>
			<TaskTable tasks={tasks} />
		</div>
	);
}
