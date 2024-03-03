/** @type {import("eslint").Linter.Config} */
const config = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
	},
	plugins: ["@typescript-eslint", "import"],
	extends: [
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
	],
	rules: {
		// These opinionated rules are enabled in stylistic-type-checked above.
		// Feel free to reconfigure them to your own preference.
		"@typescript-eslint/array-type": "off",
		"@typescript-eslint/consistent-type-definitions": "off",

		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			},
		],
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ argsIgnorePattern: "^_" },
		],
		"@typescript-eslint/no-misused-promises": [
			2,
			{
				checksVoidReturn: { attributes: false },
			},
		],
		"import/order": [
			"error",
			{
				groups: ["builtin", "external", "internal"],
				pathGroups: [
					{
						pattern: "react",
						group: "external",
						position: "before",
					},
				],
				pathGroupsExcludedImportTypes: ["react"],
				"newlines-between": "always",
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
			},
		],
	},
	overrides: [
		{
			files: ["src/components/ui/**"],
			rules: {
				"@typescript-eslint/consistent-type-imports": "off",
			},
		},
		{
			files: ["src/**"],
			rules: {
				"react-hooks/exhaustive-deps": "off",
			},
		},
	],
};

module.exports = config;
