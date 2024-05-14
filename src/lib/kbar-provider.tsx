"use client";

import { HomeIcon } from "@radix-ui/react-icons";
import { KBarProvider as KBarProviderImpl } from "kbar";
import { useRouter } from "next/navigation";

type Props = {
	children: React.ReactNode;
};

export default function KBarProvider({ children }: Props) {
	const router = useRouter();

	const initialActions = [
		{
			id: "home",
			name: "Home",
			icon: <HomeIcon />,
			shortcut: ["g", "h"],
			perform: () => router.push("/"),
			section: "Navigation",
		},
	];

	return (
		<KBarProviderImpl actions={initialActions}>{children}</KBarProviderImpl>
	);
}
