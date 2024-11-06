/* eslint-disable @next/next/no-img-element */
import {
	AlertTriangleIcon,
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

import Footer from "~/components/Footer";
import { cn } from "~/lib/utils";

import ButtonOptions from "./components/ButtonOptions";
import GridWrapper from "./components/grid/GridWrapper";
import Panel from "./components/marketing/Panel";
import "~/styles/homepage.css";
import AiAutocompletePropertiesPanel from "./components/marketing/panels/AiAutocompletePropertiesPanel";
import AiTaskCreationPanel from "./components/marketing/panels/AiTaskCreationPanel";
import CommunicationPanel from "./components/marketing/panels/CommunicationPanel";
import NotificationPanel from "./components/marketing/panels/NotificationPanel";
import TextCycleWrapper from "./components/text-cycle/TextCycleWrapper";
import ExampleTextEditor from "./components/ExampleTextEditor";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });
const sora = Sora({ subsets: ["latin"] });

export const dynamic = "force-static";

export default function HomePage() {
	return (
		<div className={cn(sora.className, "flex flex-1 flex-col")}>
			<div className="absolute top-0 z-[-1] h-svh w-full overflow-hidden fade-in-5">
				{/* <GridWrapper /> */}
				<img
					className="absolute h-full w-full opacity-25 blur-2xl"
					src="/static/auth-slow.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent from-[1%] to-background to-[80%]" />
			</div>
			<div className="flex-1 px-4 lg:px-8">
				<section className="z-10 mb-32 mt-32 flex flex-col items-center justify-center">
					<div className="flex w-full max-w-[1400px] flex-col items-center justify-center">
						<h1
							className={cn(
								poppins.className,
								"-translate-y-1 scroll-m-20 text-center text-5xl font-medium uppercase drop-shadow-md sm:text-6xl lg:text-7xl",
							)}
							data-testid="marketing-title"
						>
							Taskly simplifies
							<TextCycleWrapper />
							<div className="absolute top-0 -z-10 h-full w-full scale-150 bg-background blur-[8rem]" />
						</h1>
						<p className="sm:text-md z-20 mb-12 mt-2 max-w-[800px] text-center text-sm leading-7 lg:text-lg">
							Built for small teams to simplify success and finish
							projects.
						</p>
						<ButtonOptions />
					</div>
				</section>
				<section className="mb-16 flex flex-col items-center justify-center">
					<div className="grid max-w-[1400px] gap-4 pb-8 md:max-h-[667px] md:grid-cols-2 lg:px-0 xl:grid-cols-4 xl:grid-rows-2">
						<Panel
							title="Global Search"
							description="Get things done without touching your mouse."
							icon={<Brain size={16} />}
							className="md:col-span-2 xl:col-span-1 xl:row-span-2"
						/>
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
				<section className="flex mb-32 mt-32 items-center justify-center w-full">
					<AiAutocompletePropertiesPanel />
				</section>
				<section className="mb-32 flex flex-col items-center justify-center px-0 pb-0 xl:px-16">
					<div className="relative mb-4 w-full max-w-[1400px] rounded-lg">
						<div className="mix-blend-lighten">
							<div className="animated-border absolute h-full w-full rounded-lg bg-background"></div>
						</div>
						<div className="absolute left-0 top-0 h-full w-full rounded-lg backdrop-blur-xl"></div>
						<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
							<AiTaskCreationPanel />
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
				</section>
			</div>
			<Footer />
		</div>
	);
}
