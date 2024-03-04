import React from "react"; // replace 'your-library' with the actual library you're using

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

interface Props {
	step: number;
	currentStep: number;
	setStep: (step: number) => void;
	stepTitle: string;
	disabled: boolean;
	children: React.ReactNode;
}

const StepButton = ({
	step,
	currentStep,
	setStep,
	stepTitle,
	disabled,
	children,
}: Props) => {
	return (
		<div className="flex gap-4">
			<Button
				size="icon"
				variant="outline"
				disabled={disabled}
				className={cn(
					"aspect-square rounded-full",
					currentStep === step &&
						"bg-accent-foreground text-background",
				)}
				onClick={() => setStep(step)}
			>
				{step}
			</Button>
			<div className="grid ">
				<p
					className={cn(
						typography.paragraph.p_muted,
						"flex items-center gap-2 text-xs",
					)}
				>
					{children} Step {step}
				</p>
				<p className="whitespace-nowrap">{stepTitle}</p>
			</div>
		</div>
	);
};

export default StepButton;
