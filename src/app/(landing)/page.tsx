/* eslint-disable @next/next/no-img-element */
import {
	ArrowRight,
	Bell,
	BookIcon,
	Brain,
	LampDesk,
	Rabbit,
} from "lucide-react";
import Image from "next/image";

import Footer from "~/app/components/Footer";
import AnimatedShinyText from "~/components/magicui/animated-shiny-text";
import WordRotate from "~/components/magicui/word-rotate";
import { cn } from "~/lib/utils";

import ButtonOptions from "./components/ButtonOptions";
import GridWrapper from "./components/grid/GridWrapper";
import Panel from "./components/marketing/Panel";
import "~/styles/homepage.css";

export const dynamic = "force-static";

export default function HomePage() {
	return (
		<div className={cn("flex flex-1 flex-col")}>
			<section className="relative py-32">
				<div className="absolute top-0 z-[-1] h-full w-full fade-in-5">
					<GridWrapper />
					<Image
						className="absolute h-full w-full opacity-100"
						fill
						src="/static/background.webp"
						alt="backdrop"
					/>
					<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
				</div>
				<div className="container max-w-[1400px] px-8">
					<div
						className={cn(
							"group mb-4 w-fit rounded-full border border-white/5 text-base backdrop-blur-lg transition-all ease-in hover:cursor-pointer hover:bg-neutral-800",
						)}
					>
						<AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 text-neutral-400 transition ease-out hover:duration-300">
							<span>✨ Free to use</span>
							<ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
						</AnimatedShinyText>
					</div>
					<h1 className="text-7xl font-bold drop-shadow-md">
						Taskly Simplifies
					</h1>
					<WordRotate
						className="bg-gradient-to-r bg-clip-text py-1 text-6xl font-bold tracking-tighter text-transparent drop-shadow-md"
						words={[
							"Agile Project Management",
							"Collaboration and Teamwork",
							"Task Creation and Sprints",
							"Workflows and Integrations",
						]}
					/>
					<div className="pt-16">
						<ButtonOptions />
					</div>
				</div>
			</section>
			<section className="container max-w-[1400px] px-8">
				<div className="grid max-w-[1400px] gap-4 pb-8 md:max-h-[667px] md:grid-cols-2 lg:px-0 xl:grid-cols-4 xl:grid-rows-2">
					<Panel
						title="AI Features"
						description="Streamline tasks and boost
							productivity."
						icon={<Brain size={124} />}
						className="md:col-span-2 xl:col-span-1 xl:row-span-2"
					/>
					<Panel
						title="Fast & Realtime"
						description="Collaborate and work in real time."
						icon={<Rabbit size={124} />}
						className="xl:col-span-2"
						color="red"
					/>
					<Panel
						title="Simple"
						description="Get up to speed quickly, and onboard your team effortlessly."
						icon={<LampDesk size={124} />}
						className="xl:row-span-2"
						color="yellow"
					/>
					<Panel
						title="Stay Notified"
						description="Catch up on what you missed and stay in the know."
						icon={<Bell size={124} />}
						color="green"
					/>
					<Panel
						title="Documentation"
						description="Get confused? Our user guides are here to help!"
						icon={<BookIcon size={124} />}
						color="blue"
					/>
				</div>
			</section>
			<section className="container relative mb-32 max-w-[1400px]">
				<div className="relative">
					<div className="animated-border absolute h-full w-full rounded-lg bg-background"></div>
					<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
						<Image
							src="/static/marketing/taskboard.webp"
							fill
							alt="Taskly Taskboard"
							priority
						/>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
