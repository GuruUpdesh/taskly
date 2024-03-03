/* eslint-disable @next/next/no-img-element */
<<<<<<< Updated upstream
import { cn } from "~/lib/utils";
import { BookIcon, Brain, LampDesk, Network, Rabbit } from "lucide-react";
=======
import {
	Bell,
	BookIcon,
	Brain,
	ChevronRight,
	Group,
	Network,
	Rabbit,
	SparklesIcon,
} from "lucide-react";
import { Sora } from "next/font/google";
import Image from "next/image";
import "./landing.css";

import Grid from "~/components/page/landing/background-grid";
import ButtonOptions from "~/components/page/landing/button-options";
>>>>>>> Stashed changes
import MarketingBlock from "~/components/page/landing/marketing/marketing-block";
import MarketingTaskChips from "~/components/page/landing/marketing/marketing-task-chips";
<<<<<<< Updated upstream
import ButtonOptions from "~/components/page/landing/button-options";
import Grid from "~/components/page/landing/background-grid";
=======
import { TaskStatus } from "~/components/page/project/recent-tasks";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
>>>>>>> Stashed changes
import typography from "~/styles/typography";
import MarketingStatuses from "~/components/page/landing/marketing/marketing-statuses";

const sora = Sora({ subsets: ["latin"] });

export default function HomePage() {
	return (
		<div className={sora.className}>
			<div className="fixed z-[-1] h-full w-full fade-in-5">
				<Grid />
				<img
					className="absolute h-full w-full opacity-75"
					src="/static/auth.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
			</div>
			<div className="z-10 flex flex-col items-center justify-center p-16">
				<div
					className={cn(
						"mb-4 mt-4 flex rounded-full border px-3 py-1 backdrop-blur-lg",
						sora.className,
					)}
				>
					Opinionated Project Management
				</div>
				<div className=" animate-fade-down">
					<h1
						className={
							"-translate-y-1 scroll-m-20 text-center text-6xl font-semibold tracking-tight drop-shadow-md lg:text-7xl"
						}
					>
						Making Your Projects Simple
					</h1>
					<MarketingTaskChips />
				</div>
				<p className="mt-6 max-w-[800px] animate-fade-down text-center text-xl leading-7 opacity-0">
					Streamline your work, perfect for small teams and startups.
					Simplify success and confidently finish your projects.
				</p>
				<ButtonOptions />
				<MarketingStatuses />
				<div className="mt-32 grid w-[65%] min-w-[600px] max-w-[1600px] grid-cols-4 grid-rows-2 gap-8">
					<MarketingBlock className="group  row-span-2 overflow-hidden border border-indigo-400/15 bg-indigo-800/10 backdrop-blur-xl">
						<h3
							className={cn(
								typography.headers.h2,
								"border-none font-semibold",
							)}
						>
							AI Features
						</h3>
						<p
							className={cn(
								typography.paragraph.p_muted,
								"!m-0 text-foreground",
							)}
						>
							Enhance your workflow with cutting-edge AI. Our
							machine learning algorithms adapt to your project
							needs, streamlining tasks and boosting productivity.
						</p>
						<div className="flex-1" />
						<div className="flex w-full justify-between">
							<div className="flex aspect-square w-min items-center gap-2 rounded-lg bg-indigo-900 p-2 text-indigo-400">
								<Brain size={24} />
							</div>
							<Button variant="ghost">
								Learn More
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<div className="absolute bottom-0 right-0 -z-10 aspect-square w-[200%] gradient-mask-t-10 ">
							<Image
								src="/static/marketing/ai.webp"
								alt="Realistic depiction of a brain with electrical streaks symbolizing artificial intelligence on a black background."
								fill
								className="w-full opacity-0 mix-blend-screen transition-opacity group-hover:opacity-50 "
							/>
						</div>
					</MarketingBlock>
					<MarketingBlock className="group z-10 col-span-2 col-start-2 overflow-hidden border border-red-400/15 bg-red-800/10 backdrop-blur-xl">
						<h3
							className={cn(
								typography.headers.h2,
								"border-none font-semibold",
							)}
						>
							Fast & Realtime
						</h3>
						<p
							className={cn(
								typography.paragraph.p_muted,
								"!m-0 text-foreground",
							)}
						>
							Speed up your work with our seamless user
							experience. Gain a competitive edge with instant a
							task management system thats easy for everyone.
						</p>
						<div className="flex-1" />
						<div className="flex w-full justify-between">
							<div className="flex aspect-square w-min items-center gap-2 rounded-lg bg-red-900 p-2 text-red-400  backdrop-blur-xl">
								<Rabbit size={24} />
							</div>
							<Button variant="ghost">
								Learn More
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<div className="absolute bottom-0 right-0 h-[50%] w-full mix-blend-lighten gradient-mask-t-0 ">
							<Image
								src="/static/marketing/fast.png"
								alt="Minimalistic black background with dynamic light streaks converging towards center symbolizing streamlined efficiency and data convergence."
								fill
								className="w-full opacity-0 transition-opacity group-hover:opacity-50 "
								quality={100}
							/>
						</div>
					</MarketingBlock>
					<MarketingBlock className="group row-span-2 overflow-hidden border  border-yellow-400/15 bg-yellow-800/10 backdrop-blur-xl">
						<h3
							className={cn(
								typography.headers.h2,
								"border-none font-semibold",
							)}
						>
							Simple
						</h3>
						<p
							className={cn(
								typography.paragraph.p_muted,
								"!m-0 text-foreground",
							)}
						>
							Intuitive for all skill levels. Navigate your
							projects with an interface designed for simplicity,
							backed by powerful technology.
						</p>
						<div className="flex-1" />
						<div className="flex w-full justify-between">
							<div className="flex aspect-square w-min items-center gap-2 rounded-lg bg-yellow-900 p-2 text-yellow-400">
								<Rabbit size={24} />
							</div>
							<Button variant="ghost">
								Learn More
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<div className="absolute -bottom-[25%] -left-20 -z-10 aspect-square w-[200%] mix-blend-lighten gradient-mask-t-10 ">
							<Image
								src="/static/marketing/simple.webp"
								alt="Minimalist abstract design symbolizing simplicity and intuitive technology against a black background."
								fill
								className="w-full opacity-0 mix-blend-screen transition-opacity group-hover:opacity-50 "
							/>
						</div>
					</MarketingBlock>
					<MarketingBlock className="group overflow-hidden border border-green-400/15 bg-green-800/10 backdrop-blur-xl">
						<h3
							className={cn(
								typography.headers.h2,
								"border-none font-semibold",
							)}
						>
							Powerful API
						</h3>
						<p
							className={cn(
								typography.paragraph.p_muted,
								"!m-0 text-foreground",
							)}
						>
							We offer a powerful API that allows you to automate
							tie Taskly into your existing workflow, making your
							project management process more efficient.
						</p>
						<div className="flex-1" />
						<div className="flex w-full justify-between">
							<div className="flex aspect-square w-min items-center gap-2 rounded-lg bg-green-900 p-2 text-green-400">
								<Network size={24} />
							</div>
							<Button variant="ghost">
								Learn More
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</MarketingBlock>
					<MarketingBlock className="border border-blue-400/15 bg-blue-800/10 backdrop-blur-xl">
						<h3
							className={cn(
								typography.headers.h2,
								"border-none font-semibold",
							)}
						>
							Documentation
						</h3>
						<p
							className={cn(
								typography.paragraph.p_muted,
								"!m-0 text-foreground",
							)}
						>
							Get started quickly with comprehensive guides. Our
							detailed documentation provides all you need to
							harness the power of simplified project management.
						</p>
						<div className="flex-1" />
						<div className="flex w-full justify-between">
							<div className="flex aspect-square w-min items-center gap-2 rounded-lg bg-blue-900 p-2 text-blue-400">
								<BookIcon size={24} />
							</div>
							<Button variant="ghost">
								Learn More
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</MarketingBlock>
				</div>
				<div className="relative mt-32 w-[65%] min-w-[600px] max-w-[1600px] rounded-lg">
					<div className="absolute -right-10 top-[8%] z-10 flex translate-x-[50%] items-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
						<SparklesIcon className="h-4 w-4" />
						<p>AI Task Creation</p>
					</div>
					<div className="absolute -bottom-[2%] right-[50%] z-10 flex translate-x-[50%] items-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
						<Rabbit className="h-4 w-4" />
						<p>Realtime Collaboration</p>
					</div>
					<div className="absolute -left-10 top-[26%] z-10 flex -translate-x-[30%] items-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
						<Bell className="h-4 w-4" />
						<p>Notifications</p>
					</div>
					<div className="absolute -top-[2%] right-10 z-10 flex -translate-x-[70%] items-center gap-2 rounded-lg border px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
						<Group className="h-4 w-4" />
						<p>Filtering, Sorting, Grouping, and more!</p>
					</div>
					<div className="absolute left-0 top-0 h-full w-full backdrop-blur-xl" />
					<div className="animated-border relative aspect-[503/246] w-full overflow-hidden rounded-lg border mix-blend-lighten">
						<Image
							src="/static/taskboard.png"
							fill
							alt="Taskly Taskboard"
							quality={100}
							className="aspect-[503/246] w-full"
						/>
					</div>
				</div>
			</div>
			<footer className="border-t bg-black p-24">
				<h1>© Taskly PM | 2024</h1>
			</footer>
		</div>
	);
}
