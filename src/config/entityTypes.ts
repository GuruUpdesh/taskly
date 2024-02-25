export type ColorOptions =
	| "null"
	| "grey"
	| "orange"
	| "yellow"
	| "red"
	| "blue"
	| "purple"
	| "green"
	| "teal"
	| "fuchsia";

export interface EntityConfigText {
	value: string;
	displayName: string;
	type: "text";
	icon: JSX.Element;
	form: {
		placeholder: string;
	};
}

export interface EntityConfigSelectOption {
	value: string | number;
	displayName: string;
	icon?: JSX.Element;
	color: ColorOptions;
}

export interface EntityConfigSelect {
	value: string;
	displayName: string;
	type: "select";
	icon: JSX.Element;
	form: {
		placeholder: string;
		options: EntityConfigSelectOption[];
	};
}

export type TaskConfig = {
	id: EntityConfigText;
	title: EntityConfigText;
	description: EntityConfigText;
	points: EntityConfigSelect;
	status: EntityConfigSelect;
	priority: EntityConfigSelect;
	type: EntityConfigSelect;
	assignee: EntityConfigSelect;
	sprintId: EntityConfigSelect;
};
