import pino from "pino";

export const logger = pino({
	level: "info",
	redact: [], // prevent logging of sensitive data
});
