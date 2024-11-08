/* eslint-disable @next/next/no-img-element */
import { CheckCircledIcon, PieChartIcon } from "@radix-ui/react-icons";
import {
	ArrowRight,
	BookIcon,
	GitMerge,
	GitPullRequestArrow,
	LampDesk,
	Rabbit,
	Search,
	Text,
} from "lucide-react";
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
import WordRotate from "./components/WordRotate";
import styles from "./landing.module.css";

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default function HomePage() {
	return (
		<div className={cn(poppins.className, styles.page)}>
			<section className={cn(styles.section, "mt-32")}>
				<h1 className="-translate-y-1 scroll-m-20 text-center text-5xl font-medium capitalize sm:text-6xl lg:text-7xl">
					Taskly simplifies
				</h1>
				<WordRotate
					words={[
						"Project Management",
						"Collaboration",
						"Task Creation",
						"Integrations",
					]}
					className="bg-clip-text text-3xl leading-10 font-medium py-3 bg-gradient-to-r tracking-tighter text-transparent sm:text-6xl lg:text-7xl"
					styles={[
						"from-indigo-300 to-indigo-700",
						"from-red-300 to-red-700",
						"from-yellow-300 to-yellow-700",
						"from-green-300 to-green-700",
					]}
				/>
				<p className="sm:text-md mb-12 mt-2 max-w-[800px] text-center text-sm leading-7 lg:text-lg">
					A project management tool built for small teams.
				</p>
				<GetStartedButton />
			</section>
			<div className="absolute top-0 z-[-1] h-[900px] w-full overflow-hidden fade-in-5">
				<img
					className="absolute h-full w-full opacity-10 blur-xl"
					src="/static/auth-slow.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent from-[1%] to-background to-[80%]" />
			</div>
			<section className={styles.section}>
				<div className="absolute bottom-0 z-30 flex w-full justify-between px-8">
					<div className="max-w-[250px]">
						<h4 className="text-lg font-bold">AI Tools</h4>
						<p>Streamline tasks and boost productivity.</p>
					</div>
					<div className="max-w-[250px]">
						<h4 className="text-lg font-bold ">Notifications</h4>
						<p>Catch up on what you missed and stay in the know.</p>
					</div>
					<div className="max-w-[250px]">
						<h4 className="text-lg font-bold ">Fast Performance</h4>
						<p>Collaborate and work in real time.</p>
					</div>
				</div>
				<div className="relative max-h-[400px] w-full overflow-clip p-[1px]">
					<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent from-[50%] to-background" />
					<div className="relative mb-4 w-full rounded-lg">
						<div className="mix-blend-lighten">
							<div className="animated-border absolute h-full w-full rounded-lg bg-background"></div>
						</div>
						<div className="absolute left-0 top-0 h-full w-full rounded-lg backdrop-blur-xl"></div>
						<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
							<Image
								src="/static/marketing/taskboard.webp"
								fill
								alt="Taskly Taskboard"
								quality={100}
								className="aspect-[16/9] w-full"
								priority
							/>
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
								href="/create-project"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								View
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</Panel>
				</div>
				{/* <section className="mb-32 mt-32 flex w-full items-center justify-center">
					<AiAutocompletePropertiesPanel />
					</section> */}
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
						description="Save time and sync across platforms."
						icon={<LampDesk size={16} />}
						className=""
						color="yellow"
					>
						<div className="flex-1 pr-4">
							<div className="h-full overflow-hidden rounded-tr-lg bg-yellow-800/25">
								<div className="relative flex h-full flex-col items-center justify-between p-4">
									<div className="flex w-full items-center justify-between">
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm">
											<GitPullRequestArrow className="h-4 w-4" />
											<span>Open</span>
										</div>
										<ArrowRight className="h-4 w-4" />
										<div className="flex items-center gap-2 rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1 text-sm">
											<GitMerge className="h-4 w-4" />
											<span>Merged</span>
										</div>
									</div>
									<div className="absolute top-[-40%] rounded-full border border-foreground/5 bg-foreground/5 p-12">
										<div className="rounded-full border border-foreground/5 bg-foreground/5 p-12">
											<div className="w-fit rounded-full border border-foreground/5 bg-foreground/5 p-12"></div>
										</div>
									</div>
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
								</div>
							</div>
						</div>
					</Panel>
				</div>
			</section>
			<section className={styles.section}>
				<div className="flex w-full items-center justify-between rounded-3xl bg-foreground/5 p-8">
					<div>
						<h2 className="mb-8 w-full text-6xl text-foreground">
							Work Smarter &<br /> Get more done.
						</h2>
						<p className="mb-8">
							Perfect for small teams and startups.
						</p>
						<Button>Sign Up</Button>
						<Button variant="ghost">Create a Project</Button>
					</div>
					<AiAutocompletePropertiesPanel />
				</div>

				<p className="mt-8 text-muted-foreground">Free & Open Source</p>
			</section>
			<Footer />
		</div>
	);
}
