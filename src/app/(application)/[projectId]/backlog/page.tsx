import dynamic from "next/dynamic";
import { getProject } from "~/actions/project-actions";
import { env } from "~/env.mjs";
import { getAllTasks } from "../../../../actions/task-actions";
import TaskTable from "../../../../components/table/task-table";
const Test = dynamic(() => import("./test"), { ssr: false });

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
		<div className="container flex flex-col pt-4">
			<Test />
			<section className="mb-3">
				<p className="text-sm text-muted-foreground">
					{env.NODE_ENV.toLocaleUpperCase()} {">"} Projects {">"}{" "}
					{project.name}
				</p>
				<header className="flex items-center gap-2">
					<h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
						Backlog
					</h3>
				</header>
			</section>
			<TaskTable tasks={tasks} />
		</div>
	);
}
