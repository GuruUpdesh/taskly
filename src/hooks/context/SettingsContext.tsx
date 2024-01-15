"use client"

import React, { createContext, useContext } from "react";

const SettingsContext = createContext({
	lastProject: null,
});

export const SettingsContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<SettingsContext.Provider
			value={{
				lastProject: null,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export function useSettingsContext() {
	const settingsContext = useContext(SettingsContext);
	if (settingsContext === undefined) {
		throw new Error("useSettingsContext must be used within a SettingsContextProvider");
	}
    
	return settingsContext;
}
