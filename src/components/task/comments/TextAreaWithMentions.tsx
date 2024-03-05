"use client";

import React, { useState } from "react";

import type { ControllerRenderProps } from "react-hook-form";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import { Textarea } from "~/components/ui/textarea";
import "~/styles/mentions.css";

const mentionsStyle = {
	height: "100px",
	textWrap: "wrap",
	borderRadius: "8px",
	padding: "8px !important",
	maxWidth: "100%",
	transform: "translateY(50px);",
	opacity: "1",
};

function TextAreaWithMentions({
	mentions,
	field,
}: {
	mentions: SuggestionDataItem[];
	field: ControllerRenderProps<{ comment: string }, "comment">;
}) {
	return (
		<MentionsInput
			placeholder="Add a comment..."
			className="mentions_input !focus-visible:outline-none border bg-accent/25 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			rows={4}
			style={mentionsStyle}
			{...field}
		>
			<Mention
				trigger="@"
				data={mentions}
				style={{ fontWeight: "bold" }}
			/>
		</MentionsInput>
	);
}

export default TextAreaWithMentions;
