import { getAllTasks } from "~/app/(application)/tasks/_actions/task-actions";
import TaskTable from "~/app/(application)/tasks/table/task-table";
import { env } from "~/env.mjs";

export default async function TaskPage() {
	const tasks = await getAllTasks();
	if (tasks === undefined) return null;

	return (
		<main className="bg-background">
			<div className="container flex flex-col gap-4 px-4 py-16 ">
				<p className="text-sm text-muted-foreground">
					Organization / Projects / Project Name ({env.NODE_ENV})
				</p>
				<header className="flex items-center gap-2">
					<h3 className="scroll-m-20 text-2xl font-normal tracking-tight">
						Project Name (example)
					</h3>
					<p>{">"}</p>
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						Backlog
					</h3>
				</header>
				<TaskTable tasks={tasks} />
			</div>
		</main>
	);
}
