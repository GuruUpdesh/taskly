import {
	CheckCircledIcon,
	GitHubLogoIcon,
	PieChartIcon,
} from "@radix-ui/react-icons";
import {
	ArrowRight,
	BookIcon,
	GitMerge,
	GitPullRequestArrow,
	Rabbit,
	Search,
	Text,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import Footer from "~/components/Footer";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import ExampleTextEditor from "./components/ExampleTextEditor";
import GetStartedButton from "./components/GetStartedButton";
import GlobalSearch from "./components/GlobalSearchExample";
import Panel from "./components/marketing/Panel";
import "~/styles/homepage.css";
import AiAutocompletePropertiesPanel from "./components/marketing/panels/AiAutocompletePropertiesPanel";
const WordRotate = dynamic(() => import("./components/WordRotate"), {
	ssr: false,
	loading: () => (
		<h1 className="bg-gradient-to-r from-indigo-300 to-indigo-700 bg-clip-text py-4 text-3xl font-medium leading-10 tracking-tighter text-transparent sm:text-6xl lg:text-7xl">
			Project Management
		</h1>
	),
});
import styles from "./landing.module.css";

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default function HomePage() {
	return (
		<div className={cn(poppins.className, styles.page)}>
			<section
				className={cn(styles.section, "mt-36 px-8 md:px-4 2xl:px-0")}
			>
				<h1 className="-translate-y-1 whitespace-nowrap text-5xl font-medium sm:text-6xl lg:text-7xl">
					Taskly Simplifies
				</h1>
				<WordRotate
					words={[
						"Project Management",
						"Collaboration",
						"Task Creation",
						"Integrations",
					]}
					className="bg-gradient-to-r bg-clip-text py-3 text-5xl font-medium leading-10 tracking-tighter text-transparent sm:text-6xl lg:text-7xl"
					styles={[
						"to-indigo-300 from-indigo-400 text-4xl",
						"to-red-300 from-red-400",
						"to-yellow-300 from-yellow-400",
						"to-green-300 from-green-400",
					]}
				/>
				<p className="sm:text-md mb-12 mt-2 text-center text-sm leading-7 text-muted-foreground lg:text-lg">
					<span className="text-foreground">
						A free project management tool
					</span>{" "}
					<br className="sm:hidden" />
					built for small teams.
				</p>
				<GetStartedButton />
			</section>
			<div className="absolute top-0 -z-20 h-[900px] w-full overflow-hidden fade-in-5">
				<video
					src="/static/background-lights.webm"
					autoPlay
					controls={false}
					muted
					loop
					className="absolute opacity-25 blur-lg md:blur-xl"
					width="100%"
					height="100%"
				/>
				<div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent from-[1%] to-background to-[80%]" />
				<div
					className={cn(
						styles.radial,
						"radial-fade absolute h-full w-full",
					)}
				/>
			</div>
			<section
				className={cn(
					styles.section,
					"mt-32 overflow-x-hidden px-8 md:overflow-x-visible md:px-4 2xl:px-0",
				)}
			>
				<div className="relative aspect-video max-h-[780px] w-full rounded-xl border">
					<Image
						src="/static/marketing/taskboard.webp"
						fill
						alt="Taskly Application Example, task board project management backlog for agile tool."
						className="aspect-video w-full rounded-2xl"
						priority
					/>
					<Image
						src="/static/btn.webp"
						fill
						alt=""
						className="-z-10 opacity-10 blur-2xl"
						quality={10}
					/>
				</div>
				<div className="sticky bottom-0 z-10 flex w-[1600px] max-w-[calc(100vw-2rem)] justify-center pb-4 pt-12 md:max-w-[calc(100vw-1rem)] lg:max-w-[100vw-4px]">
					<div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent to-background to-[50%]" />
					<div className="flex w-full max-w-[1400px] flex-col justify-between gap-4 px-8 md:flex-row">
						<div className="z-10 md:max-w-[250px]">
							<h4 className="font-bold md:text-lg ">
								Fast Performance
							</h4>
							<p className="text-sm md:text-base">
								Collaborate and work in real time.
							</p>
						</div>
						<div className="z-10 md:max-w-[250px]">
							<h4 className="font-bold md:text-lg">AI Tools</h4>
							<p className="text-sm md:text-base">
								Streamline tasks and boost productivity.
							</p>
						</div>
						<div className="z-10 md:max-w-[250px]">
							<h4 className="font-bold md:text-lg ">
								Notifications
							</h4>
							<p className="text-sm md:text-base">
								Catch up on what you missed and stay in the
								know.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className={cn(styles.section, "px-8 md:px-4 2xl:px-0")}>
				<h3 className="mb-8 w-full justify-self-start text-4xl text-foreground">
					Onboard Quickly
				</h3>
				<div className="grid w-full max-w-[1400px] grid-cols-1 gap-4 md:max-h-[667px] md:grid-cols-2">
					<Panel
						title="60 Second Setup"
						description="Get your whole team on Taskly with ease."
						icon={<Rabbit size={16} />}
						color="green"
					>
						<div className="flex items-center justify-end px-4 pb-4">
							<Link
								href="/create-project"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								Create a Project{" "}
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</Panel>
					<Panel
						title="Documentation"
						description="Get confused? Our user guides are here to help!"
						icon={<BookIcon size={16} />}
						color="blue"
					>
						<div className="flex items-center justify-end px-4 pb-4">
							<Link
								href="https://docs.tasklypm.com"
								target="_blank"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								View
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</Panel>
				</div>
			</section>
			<section className={cn(styles.section, "px-8 md:px-4 2xl:px-0")}>
				<h3 className="mb-8 w-full text-4xl text-foreground">
					A Simple Solution with <br className="hidden sm:block" />{" "}
					Powerful Features
				</h3>
				<div className="grid w-full max-w-[1400px] grid-cols-1 gap-0 pb-8 sm:grid-cols-2 sm:gap-4 lg:max-h-[667px] lg:grid-cols-4">
					<Panel
						title="Global Search"
						description="Find what you are looking for."
						icon={<Search size={16} />}
						className="mb-4 sm:order-1 sm:mb-0"
					>
						<GlobalSearch />
					</Panel>
					<Panel
						title="Text Editor"
						description="Use a notion like markdown editor to describe tasks."
						icon={<Text size={16} />}
						className="col-span-2 mb-4 sm:order-3 sm:mb-0 lg:order-2"
						color="red"
					>
						<ExampleTextEditor />
					</Panel>
					<Panel
						title="GitHub Integration"
						description="Automatically sync your tasks."
						icon={<GitHubLogoIcon />}
						className="sm:order-2 lg:order-3"
						color="yellow"
					>
						<div className="flex-1 pr-4">
							<div className="h-full overflow-hidden rounded-tr-lg bg-yellow-800/35">
								<div className="relative flex h-full flex-row gap-4 p-4 sm:flex-col">
									<p className="mb-1 hidden text-sm sm:block">
										Pull Requests
									</p>
									<div className="z-10 flex w-full items-center justify-between">
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm backdrop-blur-lg">
											<GitPullRequestArrow className="h-4 w-4" />
											<span className="whitespace-nowrap">
												Open
											</span>
										</div>
										<ArrowRight className="h-4 w-4" />
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm backdrop-blur-lg">
											<GitMerge className="h-4 w-4" />
											<span className="whitespace-nowrap">
												Merged
											</span>
										</div>
									</div>
									<div className="flex-1" />
									<p className="mb-1 hidden text-sm sm:block">
										Tasks
									</p>
									<div className="z-10 flex w-full items-center justify-between">
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm backdrop-blur-lg">
											<PieChartIcon className="h-4 w-4" />
											<span className="whitespace-nowrap">
												In Progress
											</span>
										</div>
										<ArrowRight className="h-4 w-4" />
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm backdrop-blur-lg">
											<CheckCircledIcon className="h-4 w-4" />
											<span className="whitespace-nowrap">
												Done
											</span>
										</div>
									</div>
									<div className="absolute left-[50%] top-[50%] -z-10 translate-x-[-50%] translate-y-[-50%] rounded-full border border-foreground/5 bg-foreground/[0.02] p-12 mix-blend-overlay">
										<div className="rounded-full border border-foreground/5 bg-foreground/[0.02] p-12">
											<div className="rounded-full border border-foreground/5 bg-foreground/[0.02] p-12">
												<div className="rounded-full border border-foreground/5 bg-foreground/[0.02] p-12">
													<div className="rounded-full border border-foreground/[0.02] bg-foreground/[0.02] p-12">
														<div className="w-fit rounded-full border border-foreground/[0.02] bg-foreground/5 p-12">
															<GitHubLogoIcon className="invisible h-10 w-10 sm:visible" />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Panel>
				</div>
			</section>
			<section className={cn(styles.section, "px-8 md:px-4 2xl:px-0")}>
				<div className="flex w-full flex-col gap-8 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20">
					<div className="flex max-w-2xl flex-col">
						<h2 className="mb-8 w-full text-5xl text-foreground">
							Work Smarter &<br className="hidden sm:block" /> Get
							More Done.
						</h2>

						<p className="mb-8 text-muted-foreground sm:text-lg">
							<span className="font-medium text-foreground">
								Free & Open Source.
							</span>{" "}
							Perfect for small teams and startups.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row">
							<Button className="w-full sm:w-auto" asChild>
								<Link href="/sign-up" prefetch>
									Sign Up
								</Link>
							</Button>

							<Button
								variant="ghost"
								className="w-full sm:w-auto"
								asChild
							>
								<Link href="/create-project" prefetch>
									Create a Project
								</Link>
							</Button>
						</div>
					</div>

					<div className="w-full lg:w-auto">
						<AiAutocompletePropertiesPanel />
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
