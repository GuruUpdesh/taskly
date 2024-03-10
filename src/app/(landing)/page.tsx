/* eslint-disable @next/next/no-img-element */
import {
	Bell,
	BookIcon,
	Brain,
	Check,
	LampDesk,
	Rabbit,
} from "lucide-react";
import { Sora } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import Grid from "~/components/page/landing/background-grid";
import ButtonOptions from "~/components/page/landing/button-options";
import Footer from "~/components/page/landing/footer";
import MarketingTaskChips from "~/components/page/landing/marketing/marketing-task-chips";
import Panel from "~/components/page/landing/marketing/panel";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const sora = Sora({ subsets: ["latin"] });

export default function HomePage() {
	return (
		<div className={cn(sora.className, "relative flex flex-1 flex-col")}>
			<div className="fixed z-[-1] h-full w-full fade-in-5">
				<Grid />
				<img
					className="absolute h-full w-full opacity-75"
					src="/static/auth.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
			</div>
			<div className="flex-1">
				<section className="z-10 mt-4 flex flex-col items-center justify-center px-4 md:px-12 lg:px-16">
					<div className="mb-4 mt-4 flex whitespace-nowrap rounded-full border px-3 py-1 text-sm backdrop-blur-lg lg:text-lg">
						Opinionated Project Management
					</div>
					<div className=" animate-fade-down">
						<h1 className="-translate-y-1 scroll-m-20 text-center text-4xl font-semibold tracking-tight drop-shadow-md lg:text-6xl xl:text-7xl">
							Making Your Projects Simple
						</h1>
						<MarketingTaskChips />
					</div>
					<p className="mt-6 max-w-[800px] animate-fade-down text-center text-sm leading-7 opacity-0 lg:text-xl">
						Streamline your work, perfect for small teams and
						startups. Simplify success and confidently finish your
						projects.
					</p>
					<ButtonOptions />
				</section>
				<section className="flex flex-col items-center justify-center p-4 md:p-12 lg:p-16">
					<div className="relative w-full max-w-[1400px] rounded-lg">
						<div className="absolute left-0 top-0 h-full w-full backdrop-blur-xl" />
						<div className="animated-border relative aspect-[503/246] w-full overflow-hidden rounded-lg border mix-blend-lighten">
							<Image
								src="/static/marketing/taskboard.png"
								fill
								alt="Taskly Taskboard"
								quality={100}
								className="aspect-[503/246] w-full"
							/>
						</div>
					</div>
				</section>
				<section className="z-10 mb-16 flex flex-col items-center justify-center px-4 pb-0 md:px-12 lg:px-16">
					<div className="grid max-w-[1400px] gap-4 px-2 pb-8 md:grid-cols-2 lg:px-0 xl:grid-cols-4 xl:grid-rows-2">
						<Panel
							title="AI Features"
							description="Enhance your workflow with cutting-edge AI. Our
							machine learning algorithms adapt to your
							project needs, streamlining tasks and boosting
							productivity."
							icon={<Brain size={24} />}
							className="md:col-span-2 xl:col-span-1 xl:row-span-2"
						/>
						<Panel
							title="Fast & Realtime"
							description="Speed up your work with our seamless user
							experience. Gain a competitive edge with instant
							a task management system thats easy for
							everyone."
							icon={<Rabbit size={24} />}
							className="xl:col-span-2"
							color="red"
						/>
						<Panel
							title="Simple"
							description="Intuitive for all skill levels. Navigate your
						projects with an interface designed for
						simplicity, backed by powerful technology."
							icon={<LampDesk size={24} />}
							className="xl:row-span-2"
							color="yellow"
						/>
						<Panel
							title="Stay Notified"
							description="Taskly provides seamless notification integration and a UI which helps you catch up quickly."
							icon={<Bell size={24} />}
							color="green"
						/>
						<Panel
							title="Documentation"
							description="Get started quickly with comprehensive guides.
						Our detailed documentation provides all you need
						to harness the power of simplified project
						management."
							icon={<BookIcon size={24} />}
							color="blue"
						/>
					</div>
				</section>
				<section className="z-10 mb-16 flex flex-col items-center justify-center px-4 pb-0 md:px-12 lg:px-16">
					<h2 className="text-3xl font-semibold">
						Get Started Today
					</h2>
					<div className="z-10 mt-4 grid min-w-[900px] grid-cols-3 gap-4">
						<div />
						<div className="flex flex-col gap-3">
							<div className="rounded-lg border bg-background p-4 shadow-xl shadow-emerald-600/25">
								<p className="text-lg">The Only Plan</p>
								<h3 className="text-5xl font-semibold text-emerald-400">
									Free
								</h3>
								<ul className="relative flex flex-col gap-1 py-2">
									<li className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<span className="ml-2">
											Unlimited Projects
										</span>
									</li>
									<li className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<span className="ml-2">
											Unlimited Tasks
										</span>
									</li>
									<li className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<span className="ml-2">
											Unlimited Team Members
										</span>
									</li>
									<li className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<span className="ml-2">Dashboard</span>
									</li>
									<li className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<span className="ml-2">
											Project Customization
										</span>
									</li>
									<li className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<span className="ml-2">
											Realtime Collaboration
										</span>
									</li>
									<li className="flex items-center gap-1">
										<Check className="h-4 w-4" />
										<span className="ml-2">
											AI Workflows
										</span>
									</li>
								</ul>
								<Link href="/sign-up">
									<Button className="mt-4 w-full bg-emerald-500 text-foreground hover:bg-emerald-600">
										Join the Alpha
									</Button>
								</Link>
							</div>
						</div>
						<div />
					</div>
					<p className="text-sm">
						Taskly is <b>FREE</b> for everyone while in{" "}
						<b className="text-emerald-400">Alpha</b>!
					</p>
				</section>
			</div>
			<Footer />
		</div>
	);
}
