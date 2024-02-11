import React from "react";

export function Header({ children }: { children: React.ReactNode }) {
	return <h1 className="mb-4 text-4xl font-bold text-white">{children}</h1>;
}

export function Header2({ children }: { children: React.ReactNode }) {
	return <h2 className="mb-3 text-2xl font-bold text-white">{children}</h2>;
}
