import React from "react";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";

const BackButtonRelative = () => {
	const router = useRouter();

	return (
		<Button
			onClick={() => router.back()}
			variant="outline"
			size="sm"
			className="gap-2 font-semibold"
		>
			<ArrowLeftIcon />
			Back
		</Button>
	);
};

export default BackButtonRelative;
