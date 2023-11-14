import { getAllTasks } from "~/actions/taskActions";
import TaskTable from "~/components/task/TaskTable";

export default async function HomePage() {
	const tasks = await getAllTasks();
	if (!tasks) return null;

	return (
		<main className="bg-background">
			<div className="container flex flex-col gap-4 px-4 py-16 ">
				<p className="text-sm text-muted-foreground">
					AI
				</p>
				<header className="flex items-center gap-2">
					<h3 className="scroll-m-20 text-2xl font-normal tracking-tight">
						Project Name (example)
					</h3>
					<p>{">"}</p>
					<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
						
					</h3>
				</header>
				<TaskTable tasks={tasks} />
			</div>
		</main>
	);
}
