import React from "react";

import type { UseFormReturn } from "react-hook-form";

import { type TaskFormType } from "~/components/backlog/create-task";
import { type getPropertyConfig } from "~/config/taskConfigType";

import PropertyStatic from "./property-static";
import PropertySelect from "./propery-select";
import { type VariantPropsType } from "../task";

interface Props extends VariantPropsType {
	config: ReturnType<typeof getPropertyConfig>;
	form: UseFormReturn<TaskFormType>;
	onSubmit: (newTask: TaskFormType) => void;
	size: "default" | "icon";
	className?: string;
}

function Property({
	config,
	form,
	onSubmit,
	size,
	variant = "backlog",
	className = "",
}: Props) {
	if (config.type === "text") {
		return (
			<PropertyStatic
				form={form}
				property={config.key}
				variant={variant}
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
