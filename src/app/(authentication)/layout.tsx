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
			<div className="flex justify-center pt-24 relative">
				<div className="opacity-0 animate-fade-in">
					<Image 
						src="/static/auth.gif"
						alt="auth"
						width="576"
						height="371"
						className="mix-blend-screen blur-[500px] absolute rotate-90 top-48 -z-10"
						unoptimized={true}
					/>
				</div>
				{children}
			</div>
		</>
	);
}
