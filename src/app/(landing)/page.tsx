/* eslint-disable @next/next/no-img-element */
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Activity, Bell, Brain, Rabbit } from "lucide-react";

import Grid from "~/components/page/landing/background-grid";
import ButtonOptions from "~/components/page/landing/button-options";
import Footer from "~/components/page/landing/footer";
import MarketingTaskChips from "~/components/page/landing/marketing/marketing-task-chips";
import Panel from "~/components/page/landing/marketing/panel";
import ActivityPanel from "~/components/page/landing/marketing/panels/activity-panel";
import AiPanel from "~/components/page/landing/marketing/panels/ai-panel";
import CommunicationPanel from "~/components/page/landing/marketing/panels/communication-panel";
import NotificationPanel from "~/components/page/landing/marketing/panels/notification-panel";
import "~/styles/homepage.css";

export default function HomePage() {
	return (
		<div className={"relative flex flex-1 flex-col"}>
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
				<section className="z-10 mt-16 flex flex-col items-center justify-center px-4 md:px-12 lg:px-16">
					<div className="lg:text-md before::content-none gradient-border relative mb-4 flex overflow-hidden rounded-full px-3 py-1 text-sm backdrop-blur-lg before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-indigo-600/50 before:via-yellow-600/50 before:to-indigo-600/50 before:p-[1px]">
						<span className="whitespace-nowrap">
							Opinionated Project Management
						</span>
					</div>
					<div className="mb-4">
						<h1 className="-translate-y-1 scroll-m-20 text-center text-4xl font-semibold tracking-tight drop-shadow-md lg:text-5xl xl:text-6xl xl:leading-[1.15]">
							<span className="bg-gradient-to-b from-gray-300 to-gray-50 bg-clip-text text-transparent">
								Making Your Projects Simple
							</span>
						</h1>
						{/* <MarketingTaskChips /> */}
					</div>
					<p className="mb-8 max-w-[800px] text-center text-sm leading-7 opacity-80 lg:text-xl">
						Simplify success and finish your projects with
						confidence.
					</p>
					<ButtonOptions />
				</section>
				{/* <section className="flex flex-col items-center justify-center p-4 md:p-12 lg:p-16">
					<div className="relative w-full max-w-[1400px] rounded-lg">
						<div className="absolute left-0 top-0 h-full w-full backdrop-blur-xl" />
						<div className="animated-border relative aspect-[503/246] w-full overflow-hidden rounded-lg border mix-blend-lighten">
							<Image
								src="/static/marketing/taskboard.png"
								fill
								alt="Taskly Taskboard"
								quality={100}
								className="aspect-[503/246] w-full"
								priority
							/>
						</div>
					</div>
				</section> */}
				<section className="mb-32 mt-16 flex flex-col items-center justify-center px-4 pb-0 md:px-12 lg:px-16">
					<div className="grid max-h-[667px] max-w-[1400px] gap-4 px-2 pb-8 md:grid-cols-2 lg:px-0 xl:grid-cols-4 xl:grid-rows-2">
						<Panel
							title="AI Features"
							description="Enhance your workflow with cutting-edge AI. Our
							machine learning algorithms adapt to your
							project needs, streamlining tasks and boosting
							productivity."
							icon={<Brain size={24} />}
							className="md:col-span-2 xl:col-span-1 xl:row-span-2"
						>
							<AiPanel />
						</Panel>
						<Panel
							title="Fast & Realtime"
							description="Seamless, instant task management."
							icon={<Rabbit size={24} />}
							className="xl:col-span-2"
							color="red"
						/>
						<Panel
							title="Communication"
							description="Intuitive, powerful interface."
							icon={
								<ChatBubbleIcon className="h-[24px] w-[24px]" />
							}
							className="xl:row-span-2"
							color="yellow"
						>
							<CommunicationPanel />
						</Panel>
						<Panel
							title="Stay Notified"
							description="Taskly provides seamless notification integration and a UI which helps you catch up quickly."
							icon={<Bell size={18} />}
							color="green"
						>
							<NotificationPanel />
						</Panel>
						<Panel
							title="Activity"
							description="Comprehensive guides."
							icon={<Activity size={24} />}
							color="blue"
						>
							<ActivityPanel />
						</Panel>
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
