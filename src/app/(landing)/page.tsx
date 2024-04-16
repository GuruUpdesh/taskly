/* eslint-disable @next/next/no-img-element */
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import {
	Activity,
	AlertTriangleIcon,
	Bell,
	BookIcon,
	Brain,
	Check,
	LampDesk,
	MessageCircle,
	Rabbit,
} from "lucide-react";
import Image from "next/image";

import Grid from "~/components/page/landing/background-grid";
import ButtonOptions from "~/components/page/landing/button-options";
import Footer from "~/components/page/landing/footer";
import Panel from "~/components/page/landing/marketing/panel";
import AutocompleteProperties from "~/components/page/landing/marketing/panels/ai-panels/autocomplete-properties";
import CommunicationPanel from "~/components/page/landing/marketing/panels/communication-panel";
import NotificationPanel from "~/components/page/landing/marketing/panels/notification-panel";
import "~/styles/homepage.css";

export default function HomePage() {
	return (
		<div className={" flex flex-1 flex-col"}>
			<div className="absolute top-0 z-[-1] h-full w-full bg-[#020817] fade-in-5">
				<Grid />
				<img
					className="absolute h-full w-full opacity-75"
					src="/static/auth.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
			</div>
			<div className="flex-1">
				<section className="z-10 mt-16 flex flex-col items-center justify-center px-4 md:px-12 lg:px-16">
					<div className="text-md mb-2 flex whitespace-nowrap rounded-full border px-3 py-1 backdrop-blur-lg">
						Collaborate, Sync, and Succeed
					</div>
					<div className="mb-2">
						<h1 className="-translate-y-1 scroll-m-20 text-center text-4xl font-semibold drop-shadow-md lg:text-5xl xl:text-6xl xl:leading-[1.15]">
							<span className="bg-gradient-to-r from-gray-200 to-gray-50 bg-clip-text text-transparent">
								Project Management {""}
							</span>
							<span className="text-yellow-300">Simplified</span>
						</h1>
						{/* <MarketingTaskChips /> */}
					</div>
					<p className="text-md mb-6 max-w-[800px] text-center leading-7 opacity-75">
						Streamline your work, communicate requirements, and all
						built for small teams and startups.
					</p>
					<ButtonOptions />
				</section>
				<section className="mb-16 mt-16 flex flex-col items-center justify-center px-4 pb-0 md:px-12 lg:px-16">
					<div className="grid max-h-[667px] max-w-[1400px] gap-4 px-2 pb-8 md:grid-cols-2 lg:px-0 xl:grid-cols-4 xl:grid-rows-2">
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
				<section className="mb-32 flex flex-col items-center justify-center px-4 pb-0 md:px-12 lg:px-16">
					<div className="relative mb-4 w-full max-w-[1400px] rounded-lg">
						<div className="absolute left-0 top-0 h-full w-full backdrop-blur-xl" />
						<div className="animated-border relative aspect-[503/246] w-full overflow-hidden rounded-lg border mix-blend-lighten">
							<Image
								src="/static/marketing/Taskboard.png"
								fill
								alt="Taskly Taskboard"
								quality={100}
								className="aspect-[503/246] w-full"
								priority
							/>
						</div>
					</div>
					<div className="grid w-full max-w-[1400px] grid-cols-12 gap-4">
						<div className="group z-10 col-span-4 flex flex-col overflow-hidden rounded-lg border bg-accent/25 p-1 backdrop-blur-xl">
							<div className="p-3 gradient-mask-b-80">
								<AutocompleteProperties />
							</div>
							<div className="flex-1" />
							<div className="flex flex-col items-center rounded-lg border bg-accent/50 p-2">
								<div className="flex items-center gap-1">
									<Check className="h-4 w-4" />
									<h3 className="font-semibold">
										Autocomplete Properties
									</h3>
								</div>
								<p className="opacity-75">Move faster</p>
							</div>
						</div>
						<div className="group z-10 col-span-3 flex flex-col overflow-hidden rounded-lg border bg-accent/25 p-1 backdrop-blur-xl">
							<div className="gradient-mask-t-80">
								<div className="gradient-mask-l-80">
									<div className="gradient-mask-r-80">
										<div className="p-3 gradient-mask-b-80">
											<NotificationPanel />
										</div>
									</div>
								</div>
							</div>
							<div className="flex-1" />
							<div className="flex flex-col items-center rounded-lg border bg-accent/50 p-2">
								<div className="flex items-center gap-1">
									<AlertTriangleIcon className="h-4 w-4" />
									<h3 className="font-semibold">
										Alerts for Everything
									</h3>
								</div>
								<p className="opacity-75">Stay in the know</p>
							</div>
						</div>
						<div className="group z-10 col-span-5 flex flex-col overflow-hidden rounded-lg border bg-accent/25 p-1 backdrop-blur-xl">
							<div className="p-3 gradient-mask-b-80">
								<CommunicationPanel />
							</div>
							<div className="flex-1" />
							<div className="flex flex-col items-center rounded-lg border bg-accent/50 p-2">
								<div className="flex items-center gap-1">
									<MessageCircle className="h-4 w-4" />
									<h3 className="font-semibold">
										Collaborate & Communicate
									</h3>
								</div>
								<p className="opacity-75">
									Talk with your team
								</p>
							</div>
						</div>
					</div>
				</section>
				{/* <section className="z-10 mb-32 flex flex-col items-center justify-center px-4 pb-0 md:px-12 lg:px-16">
					<div className="z-10 grid min-w-[900px] grid-cols-3 gap-4">
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
				</section> */}
			</div>
			<Footer />
		</div>
	);
}
