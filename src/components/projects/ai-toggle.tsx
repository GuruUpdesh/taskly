"use client";

import { toggleAIFeature } from "~/actions/ai/ai-action";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
	isChecked: boolean;
	projectId: number;
};

function AIToggle({ isChecked, projectId }: Props) {
	return (
		<div className="flex items-center space-x-2">
			<Switch
				id="toggle-ai"
				onCheckedChange={() => toggleAIFeature(isChecked, projectId)}
				checked={isChecked}
			/>
			<Label htmlFor="toggle-ai">Toggle AI Feature</Label>
		</div>
	);
}

export default AIToggle;
