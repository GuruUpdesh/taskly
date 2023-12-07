// Import necessary modules
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Button variant="outline" size="icon" onClick={toggleTheme}>
			{theme === "light" ? (
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
