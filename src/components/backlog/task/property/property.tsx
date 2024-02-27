import React from "react";

import type { UseFormReturn } from "react-hook-form";

import { type getPropertyConfig } from "~/config/TaskConfigType";

import PropertyStatic from "./property-static";
import PropertySelect from "./propery-select";
import { type TaskFormType } from "../../create-task";

type Props = {
	config: ReturnType<typeof getPropertyConfig>;
	form: UseFormReturn<TaskFormType>;
	onSubmit: (newTask: TaskFormType) => void;
	size: "default" | "icon";
	className?: string;
};

function Property({ config, form, onSubmit, size, className = "" }: Props) {
	if (config.type === "text") {
		return (
			<PropertyStatic
				form={form}
				property={config.key}
				className={className}
			/>
		);
	}

	if (config.type === "enum" || config.type === "dynamic") {
		return (
			<PropertySelect
				form={form}
				config={config}
				onSubmit={onSubmit}
				size={size}
				className={className}
			/>
		);
	}

	return <div>{config.key}</div>;
}

export default Property;
