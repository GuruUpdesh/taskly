/* eslint-disable @next/next/no-img-element */
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "~/lib/utils";
import { BookIcon, Brain, LampDesk, Network, Rabbit } from "lucide-react";
import MarketingBlock from "~/components/landing/marketing-block";
import MarketingGrid from "~/components/landing/marketing-grid";
import MarketingTaskChips from "~/components/landing/marketing-task-chips";
import MarketingSubHeaderChips from "~/components/landing/marketing-subheader-chips";
import ButtonOptions from "~/components/landing/button-options";
import Grid from "~/components/landing/background-grid";

const plexSans = IBM_Plex_Sans({
	weight: ["300", "500", "700"],
	subsets: ["latin"],
});

export default function HomePage() {
	return (
		<div>
			<div className="absolute z-[-1] h-full w-full fade-in-5">
				<Grid />
				<img
					className="absolute h-full w-full opacity-75"
					src="/static/auth.gif"
					alt="backdrop"
				/>
				<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
			</div>
			<div className="z-10 flex flex-col items-center justify-center p-16">
				<div
					className="mt-8 animate-fade-down"
					style={{
						maskImage:
							"linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.5))",
					}}
				>
					<h1
						className={cn(
							plexSans.className,
							"scroll-m-20 text-center text-6xl font-normal tracking-tight drop-shadow-md lg:text-7xl",
						)}
					>
						Agile project management (staging)
					</h1>
					<MarketingTaskChips />
					<MarketingSubHeaderChips plexSans={plexSans.className} />
				</div>
				<p className="mt-6 max-w-[800px] animate-fade-down text-center text-xl leading-7 text-muted-foreground opacity-0">
					Streamline your project management with Taskly. Perfect for
					small teams and startups, it&apos;s user-friendly and
					efficient. Simplify success and confidently transform your
					projects.
				</p>
				<ButtonOptions />
				<div
					className="h-[700px] w-[1300px] py-12"
					style={{ perspective: "2000px" }}
				>
					<MarketingGrid>
						<MarketingBlock className="row-span-2  bg-indigo-800">
							<div className="flex w-min items-center gap-2 rounded-lg border border-indigo-400 bg-indigo-900 p-1 text-indigo-400">
								<Brain size={24} />
								<p className=" whitespace-nowrap">
									AI Integration
								</p>
							</div>
							<p className="text-indigo-100 opacity-70">
								Our AI integration allows you to automate your
								workflow and make your project management
								process more efficient.
								<br />
								<br />
								We use the latest in machine learning to provide
								you with the best experience possible.
							</p>
						</MarketingBlock>
						<MarketingBlock className="z-10 col-span-2  col-start-2 bg-red-800">
							<div className="flex w-min items-center gap-2 rounded-lg border border-red-400 bg-red-900 p-1 text-red-400">
								<Rabbit size={24} />
								<p className=" whitespace-nowrap">Fast</p>
							</div>
							<p className="text-red-100 opacity-70">
								Our AI integration allows you to automate your
								workflow and make your project management
								process more efficient.
								<br />
								<br />
								We use the latest in machine learning to provide
								you with the best experience possible.
							</p>
						</MarketingBlock>
						<MarketingBlock className="row-span-2  bg-yellow-800">
							<div className="flex w-min items-center gap-2 rounded-lg border border-yellow-400 bg-yellow-900 p-1 text-yellow-400">
								<LampDesk size={24} />
								<p className=" whitespace-nowrap">Simple</p>
							</div>
							<p className="text-yellow-100 opacity-70">
								Our AI integration allows you to automate your
								workflow and make your project management
								process more efficient.
								<br />
								<br />
								We use the latest in machine learning to provide
								you with the best experience possible.
							</p>
						</MarketingBlock>
						<MarketingBlock className="bg-green-800 ">
							<div className="flex w-min items-center gap-2 rounded-lg border border-green-400 bg-green-900 p-1 text-green-400">
								<Network size={24} />
								<p className=" whitespace-nowrap">
									Powerfull API
								</p>
							</div>
							<p className="text-green-100 opacity-70">
								Our AI integration allows you to automate your
								workflow and make your project management
								process more efficient.
							</p>
						</MarketingBlock>
						<MarketingBlock className="bg-blue-800 ">
							<div className="flex w-min items-center gap-2 rounded-lg border border-blue-400 bg-blue-900 p-1 text-blue-400">
								<BookIcon size={24} />
								<p className=" whitespace-nowrap">Documented</p>
							</div>
							<p className="text-blue-100 opacity-70">
								Our AI integration allows you to automate your
								workflow and make your project management
								process more efficient.
							</p>
						</MarketingBlock>
					</MarketingGrid>
				</div>
			</div>
			<footer className="border-t bg-black p-24">
				<h1>© Taskly PM | 2024</h1>
			</footer>
		</div>
	);
}
