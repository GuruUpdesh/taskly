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
			<section className={cn(styles.section, "mt-36")}>
				<h1 className="-translate-y-1 text-5xl font-medium sm:text-6xl lg:text-7xl">
					Taskly Simplifies
				</h1>
				<WordRotate
					words={[
						"Project Management",
						"Collaboration",
						"Task Creation",
						"Integrations",
					]}
					className="bg-gradient-to-r bg-clip-text py-3 text-3xl font-medium leading-10 tracking-tighter text-transparent sm:text-6xl lg:text-7xl"
					styles={[
						"to-indigo-300 from-indigo-400",
						"to-red-300 from-red-400",
						"to-yellow-300 from-yellow-400",
						"to-green-300 from-green-400",
					]}
				/>
				<p className="sm:text-md mb-12 mt-2 text-center text-sm leading-7 text-muted-foreground lg:text-lg">
					<span className="text-foreground">
						A free project management tool
					</span>{" "}
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
					className="absolute opacity-25 blur-xl"
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
			<section className={cn(styles.section, "mt-32")}>
				<div className="relative min-h-[780px] w-full rounded-xl border">
					<Image
						src="/static/marketing/taskboard.webp"
						fill
						alt="Taskly Application Example, task board project management backlog for agile tool."
						className="w-full rounded-2xl"
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
				<div className="sticky bottom-0 z-10 flex w-[1600px] max-w-[100vw] justify-center pb-4 pt-12">
					<div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent to-background to-[50%]" />
					<div className="flex w-full max-w-[1400px] justify-between px-8">
						<div className="z-10 max-w-[250px]">
							<h4 className="text-lg font-bold ">
								Fast Performance
							</h4>
							<p>Collaborate and work in real time.</p>
						</div>
						<div className="z-10 max-w-[250px]">
							<h4 className="text-lg font-bold">AI Tools</h4>
							<p>Streamline tasks and boost productivity.</p>
						</div>
						<div className="z-10 max-w-[250px]">
							<h4 className="text-lg font-bold ">
								Notifications
							</h4>
							<p>
								Catch up on what you missed and stay in the
								know.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className={styles.section}>
				<h3 className="mb-8 w-full justify-self-start text-4xl text-foreground">
					Onboard Quickly
				</h3>
				<div className="grid w-full max-w-[1400px] grid-cols-2 gap-4 md:max-h-[667px]">
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
			<section className={styles.section}>
				<h3 className="mb-8 w-full text-4xl text-foreground">
					A Simple Solution with <br /> Powerful Features
				</h3>
				<div className="grid w-full max-w-[1400px] grid-cols-4 gap-4 pb-8 md:max-h-[667px]">
					<Panel
						title="Global Search"
						description="Find what you are looking for."
						icon={<Search size={16} />}
						className=""
					>
						<GlobalSearch />
					</Panel>
					<Panel
						title="Text Editor"
						description="Use a notion like markdown editor to describe tasks."
						icon={<Text size={16} />}
						className="col-span-2"
						color="red"
					>
						<ExampleTextEditor />
					</Panel>
					<Panel
						title="GitHub Integration"
						description="Automatically sync your tasks."
						icon={<GitHubLogoIcon />}
						className=""
						color="yellow"
					>
						<div className="flex-1 pr-4">
							<div className="h-full overflow-hidden rounded-tr-lg bg-yellow-800/25">
								<div className="relative flex h-full flex-col p-4">
									<p className="mb-1 text-sm">
										Pull Requests
									</p>
									<div className="flex w-full items-center justify-between">
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm backdrop-blur-md">
											<GitPullRequestArrow className="h-4 w-4" />
											<span>Open</span>
										</div>
										<ArrowRight className="h-4 w-4" />
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm backdrop-blur-md">
											<GitMerge className="h-4 w-4" />
											<span>Merged</span>
										</div>
									</div>
									<div className="flex-1" />
									<p className="mb-1 text-sm">Tasks</p>
									<div className="flex w-full items-center justify-between">
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm">
											<PieChartIcon className="h-4 w-4" />
											<span>In Progress</span>
										</div>
										<ArrowRight className="h-4 w-4" />
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm">
											<CheckCircledIcon className="h-4 w-4" />
											<span>Done</span>
										</div>
									</div>
									<div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full border border-foreground/5 bg-foreground/[0.02] p-12 mix-blend-overlay">
										<div className="rounded-full border border-foreground/5 bg-foreground/[0.02] p-12">
											<div className="rounded-full border border-foreground/5 bg-foreground/[0.02] p-12">
												<div className="rounded-full border border-foreground/5 bg-foreground/[0.02] p-12">
													<div className="rounded-full border border-foreground/[0.02] bg-foreground/[0.02] p-12">
														<div className="w-fit rounded-full border border-foreground/[0.02] bg-foreground/5 p-12">
															<GitHubLogoIcon className="h-10 w-10" />
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
			<section className={styles.section}>
				<div className="flex w-full items-center justify-between rounded-3xl p-8">
					<div>
						<h2 className="mb-8 w-full text-5xl text-foreground">
							Work Smarter &<br /> Get more done.
						</h2>
						<p className="mb-8 text-muted-foreground">
							<span className="text-foreground">
								Free & Open Source.
							</span>{" "}
							Perfect for small teams and startups.
						</p>
						<Button asChild>
							<Link href="/sign-up" prefetch>
								Sign Up
							</Link>
						</Button>
						<Button variant="ghost" asChild>
							<Link href="/create-project" prefetch>
								Create a Project
							</Link>
						</Button>
					</div>
					<AiAutocompletePropertiesPanel />
				</div>
			</section>
			<Footer />
		</div>
	);
}
