import React from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const BackButtonRelative = () => {
	const router = useRouter();

	return (
		<Button onClick={() => router.back()} variant="ghost" className="gap-2">
			<ArrowLeftIcon />
			Back
		</Button>
	);
};

export default BackButtonRelative;
