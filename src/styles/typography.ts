const typography = {
	headers: {
		h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
		h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
		h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
		h4: "scroll-m-20 text-xl font-semibold tracking-tight",
	},
	paragraph: {
		p: "leading-7 [&:not(:first-child)]:mt-6",
		p_large: "text-lg font-semibold",
		p_lead: "text-xl text-muted-foreground",
		p_muted: "text-muted-foreground",
		p_code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
	},
	list: {
		ul: "my-6 ml-6 list-disc [&>li]:mt-2",
	},
} as const;

export default typography;
