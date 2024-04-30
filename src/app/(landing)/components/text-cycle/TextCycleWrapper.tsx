import React from "react";

import { cookies } from "next/headers";

import TextCycle from "./TextCycle";

const TextCycleWrapper = () => {
	const cycleTextHeight = cookies().get("landing-text:textHeight");
	const textHeight = cycleTextHeight
		? parseInt(cycleTextHeight.value)
		: undefined;

	return <TextCycle defaultTextHeight={textHeight} />;
};

export default TextCycleWrapper;
