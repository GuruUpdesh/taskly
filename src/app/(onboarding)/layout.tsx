/* eslint-disable @next/next/no-img-element */
import React from "react";
import BackButton from "~/components/layout/navbar/back-button";
import Grid from "~/components/page/landing/background-grid";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen flex-col">
			<header className="z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<BackButton />
				</div>
			</header>
			<div className="relative flex flex-grow justify-center">
				<div className="absolute z-[-1] h-full w-full fade-in-5">
					<Grid />
					<img
						className="absolute h-full w-full opacity-75"
						src="/static/auth.gif"
						alt="backdrop"
					/>
					<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
				</div>
				<div className="mt-24">{children}</div>
			</div>
		</div>
	);
}
