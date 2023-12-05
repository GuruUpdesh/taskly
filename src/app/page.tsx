import { getAllTasks } from "~/actions/taskActions";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "~/lib/utils";
import { Brain, LampDesk, Rabbit } from "lucide-react";
import { Button } from "~/components/ui/button";
import Grid from "~/components/branding/Grid";
import Link from "next/link";

const plexSans = IBM_Plex_Sans({ weight: ["700"], subsets: ["latin"] });

export default async function HomePage() {
	const tasks = await getAllTasks();
	if (tasks === undefined) return null;

	return (
		<main className="flex h-screen justify-center bg-blue-500/10">
			<div className="z-30 flex max-w-[900px] flex-col gap-6 py-28 text-center">
				<h1
					className={cn(
						plexSans.className,
						"scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-5xl",
					)}
				>
					Agile Project Management
				</h1>
				<p className="max-w-[600px] text-xs leading-5 text-muted-foreground">
					Simplify Your Success. Taskly offers a streamlined,
					user-friendly approach to project management, ideal for
					small teams and startups. Say goodbye to complexity and
					hello to efficient, effective project management. Transform
					your projects with ease and confidence using Taskly.
				</p>
				<div className="flex justify-between text-muted-foreground">
					<p className="flex items-center gap-2 rounded border border-red-500 bg-red-900 py-1 pl-1 pr-2 text-red-400">
						<div className="rounded bg-red-500 p-1 text-red-900">
							<Rabbit size={16} />
						</div>
						Fast Setup
					</p>
					<p className="flex items-center gap-2 rounded border border-green-500 bg-green-900 py-1 pl-1 pr-2 text-green-400">
						<div className="rounded bg-green-500 p-1 text-green-900">
							<Brain size={16} />
						</div>
						AI Workflows
					</p>
					<p className="flex items-center gap-2 rounded border border-yellow-500 bg-yellow-900 py-1 pl-1 pr-2 text-yellow-400">
						<div className="rounded bg-yellow-500 p-1 text-yellow-900">
							<LampDesk size={16} />
						</div>
						Familiar Features
					</p>
				</div>
				<div className="flex items-center justify-center gap-4">
					<Link href="/tasks">
						<Button>Get Started</Button>
					</Link>
					<Button variant="secondary">Documentation</Button>
				</div>
			</div>
			<div className="absolute left-0 top-0 z-20 h-screen w-screen bg-gradient-to-b from-transparent to-background" />
			<Grid />
			<div className="absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
				<div className="absolute h-64 w-screen animate-to-bottom-infinite bg-blue-500 opacity-25 mix-blend-overlay blur-[150px]" />
			</div>
		</main>
	);
}
