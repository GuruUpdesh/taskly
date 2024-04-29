// @ts-check
const { fontFamily } = require("tailwindcss/defaultTheme");
const containerQueriesPlugin = require("@tailwindcss/container-queries");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "2400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: {
					DEFAULT: "hsl(var(--background))",
					dialog: "#181818",
				},
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				fontFamily: {
					sans: ["var(--font-sans)", ...fontFamily.sans],
				},
			},
			ease: {
				slow: "cubic-bezier(0.6, 0.6, 0, 1)"
			},
			brightness: {
				75: "0.75",
				80: "0.8",
				85: "0.85",
				90: "0.9",
				95: "0.95",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
				"to-bottom-infinite": {
					from: { top: "-50%" },
					to: { top: "100%" },
				},
				"fade-in": {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				"fade-down": {
					"0%": { opacity: 0, transform: "translateY(-1em)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
				gradient: {
					"0%": {
						backgroundPosition: "0% 50%",
					},
					"50%": {
						backgroundPosition: "100% 50%",
					},
					"100%": {
						backgroundPosition: "0% 50%",
					},
				},
				loadBackground: {
					"0%": {
						backgroundPosition: "left"
					},
					"100%": {
						backgroundPosition: "right"
					},
       			},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"to-bottom-infinite": "to-bottom-infinite 10s linear infinite",
				"fade-in":
					"fade-in 5s cubic-bezier(0.075, 0.82, 0.165, 1) forwards",
				"fade-down":
					"fade-down 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) forwards",
				gradient: "gradient 15s ease infinite",
        "load_background": "loadBackground 1.5s linear forwards"
			},
			containers: {
				sidebar: "60px",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), containerQueriesPlugin, require("tailwind-gradient-mask-image")],
};
