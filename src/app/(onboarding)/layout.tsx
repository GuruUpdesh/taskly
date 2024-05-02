/* eslint-disable @next/next/no-img-element */
import React from "react";

import Footer from "~/app/components/Footer";
import BackButton from "~/app/components/layout/navbar/back-button";

import GridWrapper from "../(landing)/components/grid/GridWrapper";

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
			<div className="relative mb-32 flex flex-grow justify-center">
				<div className="pointer-events-none absolute h-full w-full backdrop-grayscale" />
				<div className="absolute z-[-1] h-full w-full fade-in-5">
					<GridWrapper />
					<img
						className="absolute h-full w-full opacity-75"
						src="/static/auth.gif"
						alt="backdrop"
					/>
					<div className="absolute left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent to-background" />
				</div>
				<div className="mt-24">{children}</div>
			</div>
			<Footer />
		</div>
	);
}
