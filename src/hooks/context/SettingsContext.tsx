"use client";

import React, { createContext, useContext } from "react";
import { throwClientError } from "~/utils/errors";

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
		throwClientError(
			"useSettingsContext must be used within a SettingsContextProvider",
		);
		return;
	}

	return settingsContext;
}
