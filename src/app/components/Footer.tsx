import React from "react";

import Image from "next/image";
import Link from "next/link";

import Logo from "~/app/components/Logo";
import SimpleTooltip from "~/app/components/SimpleTooltip";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

const Footer = () => {
	return (
		<footer
			className={cn(
				"flex justify-center border-t border-foreground/5 bg-background/5 py-8 backdrop-blur-xl",
			)}
		>
			<div className="w-[1400px] max-w-[1400px] px-4">
				<section className="grid grid-rows-2 lg:grid-cols-5 lg:gap-8">
					<div className="col-span-2">
						<Logo />
						<p
							className={cn(
								typography.paragraph.p_muted,
								"mt-2 text-sm",
							)}
						>
							Streamline your work, perfect for small teams and
							startups.
						</p>
					</div>
					<div className="grid grid-cols-3 gap-8 lg:col-span-3">
						<div className="flex flex-col items-start">
							<p className="font-semibold">Application</p>
							<Link
								href="/app"
								className="p-0 py-0.5 text-sm opacity-75 transition-opacity hover:underline hover:opacity-100"
							>
								Dashboard
							</Link>
							<Link
								href="/create-project"
								className="p-0 text-sm opacity-75 transition-opacity hover:underline hover:opacity-100"
							>
								Create Project
							</Link>
							<Link
								href="/settings"
								className="p-0 py-0.5 text-sm opacity-75 transition-opacity hover:underline hover:opacity-100"
							>
								Settings
							</Link>
						</div>
						<div className="flex flex-col items-start">
							<p className="font-semibold">Support</p>
							<Link
								href="https://docs.tasklypm.com"
								target="_blank"
								className="p-0 text-sm opacity-75 transition-opacity hover:underline hover:opacity-100"
							>
								Documentation
							</Link>
							<Link
								href="https://github.com/GuruUpdesh/taskly"
								target="_blank"
								className="p-0 text-sm opacity-75 transition-opacity hover:underline hover:opacity-100"
							>
								GitHub
							</Link>
						</div>
						<div className="flex flex-col items-start">
							<p className="font-semibold">Authentication</p>
							<Link
								href="/sign-in"
								className="p-0 py-0.5 text-sm opacity-75 transition-opacity hover:underline hover:opacity-100"
							>
								Sign In
							</Link>
							<Link
								href="/sign-up"
								className="p-0 py-0.5 text-sm opacity-75 transition-opacity hover:underline hover:opacity-100"
							>
								Sign Up
							</Link>
						</div>
					</div>
				</section>
				<Separator className="my-4" />
				<div className="flex items-center justify-between">
					<p className={cn(typography.paragraph.p_muted, "text-sm")}>
						Copyright © 2024 Taskly PM{" "}
					</p>
					<div className="flex items-center gap-1">
						<p
							className={cn(
								typography.paragraph.p_muted,
								"mr-2 text-sm",
							)}
						>
							A project by
						</p>
						<SimpleTooltip label="Guru Updesh Singh">
							<Link
								href="https://github.com/GuruUpdesh"
								target="_blank"
							>
								<Image
									src="/static/github/g.png"
									alt="github"
									height="24"
									width="24"
									className="rounded-full"
								/>
							</Link>
						</SimpleTooltip>
						<SimpleTooltip label="Yash Sankanagouda">
							<Link
								href="https://github.com/sankanay"
								target="_blank"
							>
								<Image
									src="/static/github/y.png"
									alt="github"
									height="24"
									width="24"
									className="rounded-full"
								/>
							</Link>
						</SimpleTooltip>
						<SimpleTooltip label="Cameron Hollis">
							<Link
								href="https://github.com/cameronhollis4"
								target="_blank"
							>
								<Image
									src="/static/github/c.png"
									alt="github"
									height="24"
									width="24"
									className="rounded-full"
								/>
							</Link>
						</SimpleTooltip>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
