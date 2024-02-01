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
				<div className="animate-fade-in opacity-0 -z-10">
					<Image
						src="/static/auth.gif"
						alt="auth"
						width="576"
						height="371"
						className="absolute top-48 rotate-90 mix-blend-screen blur-[500px]"
						unoptimized={true}
					/>
				</div>
				{children}
			</div>
		</>
	);
}
