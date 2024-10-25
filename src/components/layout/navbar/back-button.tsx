import React from "react";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const BackButton = () => {
	return (
		<Link href="/">
			<Button variant="ghost" className="gap-2">
				<ArrowLeftIcon />
				Back
			</Button>
		</Link>
	);
};

export default BackButton;
