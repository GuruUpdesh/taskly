"use client";

import React, { useState } from "react";

import { Card, CardTitle } from "~/components/ui/card";

import AutocompleteProperties from "./ai-panels/autocomplete-properties";
import TaskCreation from "./ai-panels/task-creation";

const AiPanel = () => {
	const [showAutoComplete, setShowAutoComplete] = useState(true);
	return (
		<div className="flex flex-col gap-4 mix-blend-overlay">
			<TaskCreation setShowAutoComplete={setShowAutoComplete} />
			{showAutoComplete && (
				<>
					<AutocompleteProperties />
				</>
			)}
		</div>
	);
};

export default AiPanel;
