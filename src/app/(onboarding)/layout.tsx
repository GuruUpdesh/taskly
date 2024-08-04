/* eslint-disable @next/next/no-img-element */
import React from "react";

import Footer from "~/app/components/Footer";
import BackButton from "~/app/components/layout/navbar/back-button";

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
				<div className="mt-24">{children}</div>
			</div>
			<Footer />
		</div>
	);
}
