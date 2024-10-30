"use client";

import React, { useState } from "react";

import CreateProjectForm from "~/app/(onboarding)/components/CreateProjectForm";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
type Props = {
	children: React.ReactElement;
};

const CreateProjectDialog = ({ children }: Props) => {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="min-w-fit">
				<CreateProjectForm />
			</DialogContent>
		</Dialog>
	);
};

export default CreateProjectDialog;
