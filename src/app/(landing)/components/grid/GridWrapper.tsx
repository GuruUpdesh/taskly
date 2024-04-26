import React from "react";

import { cookies } from "next/headers";

import Grid from "./Grid";

const GridWrapper = () => {
	const gridCols = cookies().get("landing-grid:cols");
	const gridRows = cookies().get("landing-grid:rows");
	const cellWidth = cookies().get("landing-grid:cellWidth");
	const cellHeight = cookies().get("landing-grid:cellHeight");

	const defaultCols = gridCols ? parseInt(gridCols.value) : undefined;
	const defaultRows = gridRows ? parseInt(gridRows.value) : undefined;
	const defaultCellWidth = cellWidth ? parseInt(cellWidth.value) : undefined;
	const defaultCellHeight = cellHeight
		? parseInt(cellHeight.value)
		: undefined;
	return (
		<Grid
			defaultCols={defaultCols}
			defaultRows={defaultRows}
			defaultCellWidth={defaultCellWidth}
			defaultCellHeight={defaultCellHeight}
		/>
	);
};

export default GridWrapper;
