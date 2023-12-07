import { type Task } from "~/server/db/schema";

export default function getPlaceholder(col: keyof Task) {
	switch (col) {
		case "title":
			return "Untitled";
		case "description":
			return "Enter a description";
		default:
			return "Select";
	}
}
