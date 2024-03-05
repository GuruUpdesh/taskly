/* eslint-disable @next/next/no-img-element */
import { BookIcon, Brain, LampDesk, Network, Rabbit } from "lucide-react";

import Grid from "~/components/page/landing/background-grid";
import ButtonOptions from "~/components/page/landing/button-options";
import MarketingBlock from "~/components/page/landing/marketing/marketing-block";
import MarketingGrid from "~/components/page/landing/marketing/marketing-grid";
import MarketingTaskChips from "~/components/page/landing/marketing/marketing-task-chips";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

export default function HomePage() {
	return (
		<div>
			<div className="absolute z-[-1] h-full w-full fade-in-5">
				<Grid />
				<img
					className="absolute h-full w-full opacity-75"
					src="/static/auth.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
			</div>
			<div className="z-10 flex flex-col items-center justify-center p-16">
				<div className="mb-4 mt-4 flex rounded-full border px-3 py-1 backdrop-blur-lg">
					Opinionated Project Management
				</div>
				<div
					className=" animate-fade-down"
					style={
						{
							// maskImage:
							// 	"linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.5))",
						}
					}
				>
					<h1
						className={
							"-translate-y-1 scroll-m-20 text-center text-6xl font-black tracking-tight drop-shadow-md lg:text-7xl"
						}
					>
						Making Your Projects Simple
					</h1>
					<MarketingTaskChips />
				</div>
				<p className="mt-6 max-w-[800px] animate-fade-down text-center text-xl leading-7 opacity-0">
					Streamline your work, perfect for small teams and startups.
					Simplify success and confidently transform your projects.
				</p>
				<ButtonOptions />
				<div
					className="h-[700px] w-[1300px] py-12"
					style={{ perspective: "2000px" }}
				>
					<MarketingGrid>
						<MarketingBlock className="row-span-2  border border-indigo-400/25 bg-indigo-800/25">
							<div className="flex w-min items-center gap-2 rounded-full bg-indigo-900 p-1 px-3 text-indigo-400">
								<Brain size={24} />
								<p className=" whitespace-nowrap">
									AI Integration
								</p>
							</div>
							<p className={cn(typography.paragraph.p, "!m-0")}>
								Enhance your workflow with cutting-edge AI. Our
								machine learning algorithms adapt to your
								project needs, streamlining tasks and boosting
								productivity.
							</p>
						</MarketingBlock>
						<MarketingBlock className="z-10 col-span-2  col-start-2 border border-red-400/25 bg-red-800/25">
							<div className="flex w-min items-center gap-2 rounded-full bg-red-900  p-1 px-3 text-red-400">
								<Rabbit size={24} />
								<p className=" whitespace-nowrap">Fast</p>
							</div>
							<p className={cn(typography.paragraph.p, "!m-0")}>
								Speed up your work with our seamless user
								experience. Gain a competitive edge with instant
								a task management system thats easy for
								everyone.
							</p>
						</MarketingBlock>
						<MarketingBlock className="row-span-2  border border-yellow-400/25 bg-yellow-800/25">
							<div className="flex w-min items-center gap-2 rounded-full bg-yellow-900 p-1 px-3 text-yellow-400">
								<LampDesk size={24} />
								<p className=" whitespace-nowrap">Simple</p>
							</div>
							<p className={cn(typography.paragraph.p, "!m-0")}>
								Intuitive for all skill levels. Navigate your
								projects with an interface designed for
								simplicity, backed by powerful technology.
							</p>
						</MarketingBlock>
						<MarketingBlock className="bg-green-800/25">
							<div className="flex w-min items-center gap-2 rounded-full bg-green-900 p-1 px-3 text-green-400">
								<Network size={24} />
								<p className=" whitespace-nowrap">
									Powerful API
								</p>
							</div>
							<p className={cn(typography.paragraph.p, "!m-0")}>
								We offer a powerful API that allows you to
								automate tie Taskly into your existing workflow,
								making your project management process more
								efficient.
							</p>
						</MarketingBlock>
						<MarketingBlock className="bg-blue-800/25">
							<div className="flex w-min items-center gap-2 rounded-full bg-blue-900 p-1 px-3 text-blue-400">
								<BookIcon size={24} />
								<p className=" whitespace-nowrap">
									Documentation
								</p>
							</div>
							<p className={cn(typography.paragraph.p, "!m-0")}>
								Get started quickly with comprehensive guides.
								Our detailed documentation provides all you need
								to harness the power of simplified project
								management.
							</p>
						</MarketingBlock>
					</MarketingGrid>
				</div>
			</div>
			<footer className="border-t bg-black p-24">
				<h1>© Taskly PM | 2024</h1>
			</footer>
		</div>
	);
}
