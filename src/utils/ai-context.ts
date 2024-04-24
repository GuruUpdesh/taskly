import { getPropertyConfig, taskProperties } from "~/config/taskConfigType";
import { type Sprint, type User } from "~/server/db/schema";

export function getTaskAiSchema(assignees: User[], sprints: Sprint[]): string {
	const properties = taskProperties.map((property) => {
		const config = getPropertyConfig(property, assignees, sprints);

		if (
			config.type !== "enum" &&
			config.type !== "dynamic" &&
			config.type !== "text"
		) {
			return "";
		}

		if (config.type === "enum" || config.type === "dynamic") {
			return `- ${config.key}: [${config.options.map((option) => `"${option.key} ${config.key === "sprintId" && option.color === "green" ? "(Current Sprint)" : ""}"`).join(", ")}]\n`;
		} else if (config.type === "text") {
			let instruction = `- ${config.key}: `;
			if (config.key === "description") {
				instruction =
					instruction +
					"[Should be concise and descriptive description of the task (optionally in markdown)]\n";
			} else if (config.key === "title") {
				instruction =
					instruction +
					"[Should be concise and descriptive title of the task]\n";
			}
			return instruction;
		}

		return "";
	});

	return `
        When creating the task follow the schema below:
        ${properties.join("")}
    `;
}
