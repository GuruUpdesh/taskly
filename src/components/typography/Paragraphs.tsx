import React from "react";

export function Paragraph({ children }: { children: React.ReactNode }) {
	return <p className="text-md mb-4 text-white">{children}</p>;
}
