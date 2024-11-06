/* eslint-disable @next/next/no-img-element */
import { ArrowRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
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

const poppins = Poppins({ weight: ["400", "500", "700"], subsets: ["latin"] });
const sora = Sora({ subsets: ["latin"] });

export const dynamic = "force-static";

export default function HomePage() {
	return (
		<div className={cn(poppins.className, "flex flex-col items-center")}>
			<section className="relative flex w-[1400px] max-w-[1400px] justify-between py-32 mb-32">
				<div className="absolute left-[50%] top-[-50%] h-[200px] w-[50%] translate-x-[-50%] bg-foreground opacity-15 blur-[150px]" />
				<div className="flex flex-col justify-center font-medium">
					<h1 className="mb-8 text-9xl uppercase leading-[5.7rem]">
						Simplified
					</h1>
					<h1 className="whitespace-nowrap text-7xl uppercase leading-[3.2rem] tracking-tight">
						Project Management.
					</h1>
				</div>
				<div className="flex flex-col justify-between">
					<button className="flex items-center rounded bg-background-dialog px-3 py-1.5 uppercase">
						Watch Demo
					</button>
					<button className="flex items-center justify-between rounded bg-foreground px-3 py-1.5 uppercase text-background">
						Sign Up
						<ArrowRight className="h-4 w-4" />
					</button>
				</div>
			</section>
			<section className="w-[1400px] max-w-[1400px] pb-32">
				<div className="relative h-[400px] overflow-hidden">
					<div className="absolute bottom-0 h-[50%] w-full bg-gradient-to-t from-background to-transparent" />
					<Image
						className="rounded border"
						src="/static/marketing/taskboard-new.png"
						height={787}
						width={1400}
						alt=""
					/>
				</div>
				<div className="flex -translate-y-5 justify-between px-8">
					<div className="max-w-[250px]">
						<h3 className="font-bold uppercase">AI Tools</h3>
						<p>Streamline tasks and boost productivity.</p>
					</div>
					<div className="max-w-[250px]">
						<h3 className="font-bold uppercase">Notifications</h3>
						<p>Catch up on what you missed and stay in the know.</p>
					</div>
					<div className="max-w-[250px]">
						<h3 className="font-bold uppercase">
							Fast Performance
						</h3>
						<p>Collaborate and work in real time.</p>
					</div>
				</div>
			</section>
			<section className="w-[1400px] max-w-[1400px] pb-32">
				<h2 className="mb-8 text-5xl">Onboard Quickly</h2>
				<div className="grid grid-cols-2 gap-8">
					<div className="group bg-background-dialog p-4 hover:bg-foreground/10">
						<h3 className="mb-1 font-bold uppercase">
							1 minute setup
						</h3>
						<p>Get your whole team setup now.</p>
						<div className="mt-4 flex justify-end">
							<p className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
								Create a Project <ArrowRightIcon />
							</p>
						</div>
					</div>
					<div className="group bg-background-dialog p-4 hover:bg-foreground/10">
						<h3 className="mb-1 font-bold uppercase">
							Documentation
						</h3>
						<p>Get your whole team setup now.</p>
						<div className="mt-4 flex justify-end">
							<p className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
								Create a Project <ArrowRightIcon />
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="w-[1400px] max-w-[1400px] pb-32">
				<h2 className="mb-8 text-5xl">
					A Simple Solution with <br />
					Powerful Features
				</h2>
				<div className="grid grid-cols-5 gap-4">
					<div className="group col-span-3 bg-background-dialog p-4">
						<h3 className="mb-1 font-bold uppercase">
							Batch Task Creation
						</h3>
						<p className="text-sm">
							Create multiple tasks quickly, with natural
							language.
						</p>
					</div>
					<div className="group col-span-2 bg-background-dialog p-4">
						<h3 className="mb-1 font-bold uppercase">
							Global Search
						</h3>
						<p className="text-sm">
							Get things done without touching your mouse.
						</p>
					</div>
					<div className="group col-span-2 bg-background-dialog p-4">
						<h3 className="mb-1 font-bold uppercase">
							Communicate
						</h3>
						<p className="text-sm">
							Discuss tasks, blockers, action items and more all
							in one place..
						</p>
					</div>
					<div className="group col-span-3 bg-background-dialog p-4">
						<h3 className="mb-1 font-bold uppercase">
							GitHub Integration
						</h3>
						<p className="text-sm">
							Save time and update tasks automatically.
						</p>
					</div>
					<div className="group col-span-3 bg-background-dialog p-4">
						<h3 className="mb-1 font-bold uppercase">
							Rich Text Editor
						</h3>
						<p className="text-sm">
							Use a notion like markdown editor to describe tasks.
						</p>
					</div>
					<div className="group col-span-2 bg-background-dialog p-4">
						<h3 className="mb-1 font-bold uppercase">
							Alerts for Everything
						</h3>
						<p className="text-sm">
							Stay in the know and sync with ease.
						</p>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
