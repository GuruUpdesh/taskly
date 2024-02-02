import Image from "next/image";
import React from "react";
import BackButton from "~/components/layout/navbar/back-button";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<BackButton />
				</div>
			</header>
			<div className="relative flex justify-center pt-24">
				<div className="-z-10 animate-fade-in opacity-0 mix-blend-screen">
					<Image
						src="/static/auth.gif"
						alt="auth"
						width="576"
						height="371"
						className="absolute top-48 rotate-90 blur-3xl"
						unoptimized={true}
					/>
				</div>
				{children}
			</div>
		</>
	);
}
