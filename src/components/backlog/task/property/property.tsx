import React from "react";

import type { UseFormReturn } from "react-hook-form";

import { type getPropertyConfig } from "~/config/TaskConfigType";
import type { NewTask } from "~/server/db/schema";

import PropertyStatic from "./property-static";
import PropertySelect from "./propery-select";

type Props = {
	config: ReturnType<typeof getPropertyConfig>
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => void;
	size: "default" | "icon";
};

function Property({
	config,
	form,
	onSubmit,
	size,
}: Props) {
	if (config.type === "text") {
		return <PropertyStatic form={form} property={config.key} />;
	}

	if (config.type === "enum" || config.type === "dynamic") {
		return (
			<PropertySelect
				form={form}
				config={config}
				onSubmit={onSubmit}
				size={size}
			/>
		);
	}

	return <div>{config.key}</div>;
}

export default Property;
