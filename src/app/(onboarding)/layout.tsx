import React from "react";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import Footer from "~/components/Footer";
import { Button } from "~/components/ui/button";

import styles from "../(landing)/landing.module.css";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<header className="z-40 bg-background">
				<div className="container flex h-16 max-w-[1400px] items-center justify-between py-4">
					<Button
						variant="outline"
						size="sm"
						className="gap-2 rounded-xl bg-background-dialog shadow-none"
						asChild
					>
						<Link href="/">
							<ArrowLeftIcon className="h-4 w-4" />
							Back
						</Link>
					</Button>
				</div>
			</header>
			<div className={styles.page}>
				<div className="mt-32 h-[calc(100svh-64px)]">{children}</div>
				<Footer />
			</div>
		</>
	);
}
