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

import Grid from "~/components/page/landing/background-grid";
import ButtonOptions from "~/components/page/landing/button-options";
import Footer from "~/components/page/landing/footer";
import Panel from "~/components/page/landing/marketing/panel";
import AutocompleteProperties from "~/components/page/landing/marketing/panels/ai-panels/autocomplete-properties";
import TaskCreation from "~/components/page/landing/marketing/panels/ai-panels/task-creation";
import CommunicationPanel from "~/components/page/landing/marketing/panels/communication-panel";
import NotificationPanel from "~/components/page/landing/marketing/panels/notification-panel";
import "~/styles/homepage.css";
import TextCycle from "~/components/page/landing/text-cycle";
import { cn } from "~/lib/utils";

const poppins = Poppins({ weight: "600", subsets: ["latin"] });
const sora = Sora({ subsets: ["latin"] });

export default function HomePage() {
	return (
		<div className={cn(sora.className, "flex flex-1 flex-col")}>
			<div className="absolute top-0 z-[-1] h-full w-full fade-in-5">
				<Grid />
				<img
					className="absolute h-full w-full opacity-100"
					src="/static/auth.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
			</div>
			<div className="flex-1">
				<section className="z-10 mb-32 mt-32 flex flex-col items-center justify-center">
					<div className="flex w-full max-w-[1400px] flex-col items-center justify-center">
						<h1
							className={cn(
								poppins.className,
								"-mb-5 -translate-y-1 scroll-m-20 text-center text-7xl font-bold leading-[1.1] drop-shadow-md",
							)}
							data-testid="marketing-title"
						>
							Taskly simplifies
							<TextCycle />
						</h1>
						<p className="mt-6 max-w-[800px] text-center text-lg leading-7 opacity-75">
							Simplify success and confidently finish your
							projects.
							<br />
							Built for small teams and startups.
						</p>
						<ButtonOptions />
					</div>
				</section>
				<section className="mb-16 flex flex-col items-center justify-center">
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
						<div className="mix-blend-lighten">
							<div className="animated-border absolute h-full w-full rounded-lg bg-background"></div>
						</div>
						<div className="absolute left-0 top-0 h-full w-full rounded-lg backdrop-blur-xl"></div>
						<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
							<TaskCreation />
							<Image
								src="/static/marketing/taskboard.webp"
								fill
								alt="Taskly Taskboard"
								quality={100}
								className="aspect-[16/9] w-full"
								priority
								unoptimized
							/>
						</div>
					</div>
					<div className="grid w-full max-w-[1400px] grid-cols-12 gap-4">
						<div className="group z-10 col-span-4 flex flex-col overflow-hidden rounded-lg border bg-background/25 p-1 backdrop-blur-xl">
							<div className="radial-gradient-mask flex flex-1 items-center justify-center overflow-hidden">
								<AutocompleteProperties />
							</div>
							<div className="flex flex-col items-center rounded-lg border bg-accent/25 p-2 backdrop-blur-xl">
								<div className="flex items-center gap-1">
									<Check className="h-4 w-4" />
									<h3 className="font-semibold">
										Autocomplete Properties
									</h3>
								</div>
								<p className="opacity-75">Move faster</p>
							</div>
						</div>
						<div className="group z-10 col-span-3 flex flex-col overflow-hidden rounded-lg border bg-background/25 p-1 backdrop-blur-xl">
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
							<div className="alert-block flex flex-col items-center rounded-lg border bg-accent/25 p-2 backdrop-blur-xl">
								<div className="flex items-center gap-1">
									<AlertTriangleIcon className="h-4 w-4" />
									<h3 className="font-semibold">
										Alerts for Everything
									</h3>
								</div>
								<p className="opacity-75">Stay in the know</p>
							</div>
						</div>
						<div className="group z-10 col-span-5 flex flex-col overflow-hidden rounded-lg border bg-background/25 p-1 backdrop-blur-xl">
							<div className="max-h-[264px] p-3">
								<CommunicationPanel />
							</div>
							<div className="flex-1" />
							<div className="flex flex-col items-center rounded-lg border bg-accent/25 p-2">
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
			</div>
			<Footer />
		</div>
	);
}
