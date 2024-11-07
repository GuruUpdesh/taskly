/* eslint-disable @next/next/no-img-element */
import {
	AlertTriangleIcon,
	ArrowRight,
	Bell,
	BookIcon,
	Brain,
	Check,
	LampDesk,
	MessageCircle,
	Rabbit,
} from "lucide-react";
import { Poppins } from "next/font/google";
import { Sora } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import Footer from "~/components/Footer";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import ButtonOptions from "./components/ButtonOptions";
import ExampleTextEditor from "./components/ExampleTextEditor";
import GlobalSearch from "./components/GlobalSearchExample";
import GridWrapper from "./components/grid/GridWrapper";
import Panel from "./components/marketing/Panel";
import "~/styles/homepage.css";
import AiAutocompletePropertiesPanel from "./components/marketing/panels/AiAutocompletePropertiesPanel";
import AiTaskCreationPanel from "./components/marketing/panels/AiTaskCreationPanel";
import CommunicationPanel from "./components/marketing/panels/CommunicationPanel";
import NotificationPanel from "./components/marketing/panels/NotificationPanel";
import TextCycleWrapper from "./components/text-cycle/TextCycleWrapper";
import styles from "./landing.module.css";

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});
const sora = Sora({ subsets: ["latin"] });

export const dynamic = "force-static";

export default function HomePage() {
	return (
		<div className={cn(poppins.className, styles.page)}>
			<section className={cn(styles.section, "mt-32")}>
				<h1 className="-translate-y-1 scroll-m-20 text-center text-5xl font-medium capitalize sm:text-6xl lg:text-7xl">
					Taskly simplifies
					<TextCycleWrapper />
					{/* <div className="absolute top-0 h-full -z-20 w-full scale-150 bg-background blur-[8rem]" /> */}
				</h1>
				<p className="sm:text-md mb-12 mt-2 max-w-[800px] text-center text-sm leading-7 lg:text-lg">
					A project management tool built for small teams.
				</p>
				<ButtonOptions />
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
								src="/static/marketing/taskboard.png"
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
				<h3 className="mb-4 w-full justify-self-start text-4xl text-foreground">
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
			<section>
				<h3 className="mb-4 text-4xl text-foreground">
					A Simple Solution with <br /> Powerful Features
				</h3>
				<div className="grid max-w-[1400px] gap-4 pb-8 md:max-h-[667px] md:grid-cols-2 lg:px-0 xl:grid-cols-4 xl:grid-rows-2">
					<Panel
						title="Global Search"
						description="Get things done without touching your mouse."
						icon={<Brain size={16} />}
						className="md:col-span-2 xl:col-span-1 xl:row-span-2"
					>
						<GlobalSearch />
					</Panel>
					<Panel
						title="Text Editor"
						description="Use a notion like markdown editor to describe tasks."
						icon={<Rabbit size={16} />}
						className="xl:col-span-2"
						color="red"
					>
						<ExampleTextEditor />
					</Panel>
					<Panel
						title="GitHub Integration"
						description="Save time and automatically update task statuses."
						icon={<LampDesk size={16} />}
						className="xl:row-span-2"
						color="yellow"
					/>
					<Panel
						title="60 Second Setup"
						description="Get your whole team on Taskly fast."
						icon={<Bell size={16} />}
						color="green"
					/>
					<Panel
						title="Documentation"
						description="Get confused? Our user guides are here to help!"
						icon={<BookIcon size={16} />}
						color="blue"
					/>
				</div>
			</section>
			<Footer />
		</div>
	);
}
