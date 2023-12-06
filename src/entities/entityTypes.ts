interface EntityConfigText {
	value: string;
	displayName: string;
	type: "text";
	form: {
		placeholder: string;
	};
}

type Entity = Record<string, string | number | null>;
interface EntityConfigSelect<T extends Entity, K extends keyof T> {
	value: string;
	displayName: string;
	type: "select";
	form: {
		placeholder: string;
		options: Array<EntityConfigFormSelectOption<T[K]>>;
	};
}

export interface EntityConfigFormSelectOption<T> {
	value: T;
	displayName: string;
	icon?: React.ReactNode;
	color: "grey" | "yellow" | "red" | "purple" | "blue" | "green";
}

type GenericEntityConfig<T extends Entity> = {
	[K in keyof T]: EntityConfigSelect<T, K> | EntityConfigText;
};

export type EntityFieldConfig =
	| EntityConfigSelect<Entity, keyof Entity>
	| EntityConfigText;

export default GenericEntityConfig;
