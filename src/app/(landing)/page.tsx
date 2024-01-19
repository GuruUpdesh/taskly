import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "~/lib/utils";
import { Brain, LampDesk, Rabbit } from "lucide-react";
import { Button } from "~/components/ui/button";
import Grid from "~/app/(landing)/background-grid";
import Link from "next/link";
import MarketingBlock from "./marketing-block";
import MarketingGrid from "./marketing-grid";

const plexSans = IBM_Plex_Sans({ weight: ["700"], subsets: ["latin"] });

export default function HomePage() {
	return (
		<>
			<div className="flex justify-center">
				<div className="z-30 flex max-w-[900px] flex-col gap-12 py-28 text-center">
					<div>
						<h1
							className={cn(
								plexSans.className,
								"scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-5xl",
							)}
						>
							Agile Project Management
						</h1>
						<p className="max-w-[600px] text-xs leading-5 text-muted-foreground mt-6">
							Simplify Your Success. Taskly offers a streamlined,
							user-friendly approach to project management, ideal for
							small teams and startups. Say goodbye to complexity and
							hello to efficient, effective project management.
							Transform your projects with ease and confidence using
							Taskly.
						</p>
					</div>
					<div className="flex justify-between text-muted-foreground">
						<p className="flex items-center gap-2 rounded border border-red-500 bg-red-900 py-1 pl-1 pr-2 text-red-400">
							<span className="rounded bg-red-500 p-1 text-red-900">
								<Rabbit size={16} />
							</span>
							Fast Setup
						</p>
						<p className="flex items-center gap-2 rounded border border-green-500 bg-green-900 py-1 pl-1 pr-2 text-green-400">
							<span className="rounded bg-green-500 p-1 text-green-900">
								<Brain size={16} />
							</span>
							AI Workflows
						</p>
						<p className="flex items-center gap-2 rounded border border-yellow-500 bg-yellow-900 py-1 pl-1 pr-2 text-yellow-400">
							<span className="rounded bg-yellow-500 p-1 text-yellow-900">
								<LampDesk size={16} />
							</span>
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
			</div>
			<div className="z-30 px-24 pb-24 overflow-x-clip mt-36" style={{perspective: "2000px"}}>
				<MarketingGrid>
					<MarketingBlock amount={0.39} className="row-span-2  bg-indigo-500" />
					<MarketingBlock amount={0.7} className="col-start-2 col-span-2  bg-red-500 z-10" />
					<MarketingBlock amount={0.39} className="row-span-2  bg-yellow-400" />
					<MarketingBlock amount={0.01} className="bg-green-500 " />
					<MarketingBlock amount={0.01} className="bg-blue-500 " />
				</MarketingGrid>
			</div>
			<footer className="bg-black border-t p-24">
				<h1>footer</h1>
			</footer>
			<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
			<Grid />
			<div className="absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
				<div className="absolute h-[300px] w-screen animate-to-bottom-infinite bg-blue-500/50 mix-blend-overlay blur-[150px] dark:bg-muted" />
			</div>
		</>
	);
}
