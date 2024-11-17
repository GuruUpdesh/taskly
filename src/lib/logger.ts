import pino from "pino";

export const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
	level: "info",

	redact: [], // prevent logging of sensitive data
});
