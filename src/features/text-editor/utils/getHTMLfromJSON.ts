import Mention from "@tiptap/extension-mention";
import { generateHTML, type JSONContent } from "@tiptap/react";

import { type User } from "~/schema";

import RenderMentionOptions from "../components/RenderMentionOptions";
import extensions from "../extensions";

export default function getHTMLfromJSON(
	jsonStringified: string,
	assignees: User[],
) {
	// prase json
	const json = JSON.parse(jsonStringified) as unknown as JSONContent;
	return generateHTML(json, [
		...extensions,
		Mention.configure({
			HTMLAttributes: {
				class: "mention",
			},
			suggestion: {
				items: ({ query }) => {
					return assignees
						.filter((user) =>
							user.username
								.toLowerCase()
								.startsWith(query.toLowerCase()),
						)
						.slice(0, 5);
				},
				render: RenderMentionOptions,
			},
		}),
	]);
}
