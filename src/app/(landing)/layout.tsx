import React from "react";

import Navbar from "~/components/layout/navbar/navbar";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
