export type ColorOptions = "null" | "grey" | "orange" | "yellow" | "red" | "blue" | "purple" | "green" | "teal" | "fuchsia";

interface EntityConfigText {
	value: string;
	displayName: string;
	type: "text";
	icon: JSX.Element;
	form: {
	  placeholder: string;
	};
  }
  
  interface EntityConfigSelectOption {
	value: string | number;
	displayName: string;
	icon?: JSX.Element;
	color: ColorOptions;
  }
  
  interface EntityConfigSelect {
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
	status: EntityConfigSelect;
	priority: EntityConfigSelect;
	type: EntityConfigSelect;
	assignee: EntityConfigSelect;
	sprintId: EntityConfigSelect;
  };