"use client";

import React, { useState, useEffect } from "react";

type Props = {
	defaultCols?: number;
	defaultRows?: number;
	defaultCellWidth?: number;
	defaultCellHeight?: number;
};

const BASE_GRID_SIZE = 130;

const Grid = ({
	defaultCols = 10,
	defaultRows = 20,
	defaultCellWidth = 0,
	defaultCellHeight = 0,
}: Props) => {
	const [cols, setCols] = useState(defaultCols);
	const [rows, setRows] = useState(defaultRows);
	const [cellSize, setCellSize] = useState({
		width: defaultCellWidth,
		height: defaultCellHeight,
	});

	useEffect(() => {
		const main = document.querySelector("main");

		const handleResize = () => {
			if (main) {
				const size = BASE_GRID_SIZE;
				const cols = Math.floor(main.clientWidth / size);
				const rows = Math.floor(main.clientHeight / size);
				const width = main.clientWidth / cols;
				const height = main.clientHeight / rows;

				setCellSize({ width, height });
				setCols(cols);
				setRows(rows);

				document.cookie = `landing-grid:cols=${cols}`;
				document.cookie = `landing-grid:rows=${rows}`;
				document.cookie = `landing-grid:cellWidth=${width}`;
				document.cookie = `landing-grid:cellHeight=${height}`;
			}
		};

		const resizeObserver = new ResizeObserver(handleResize);
		if (main) {
			resizeObserver.observe(main);
		}

		window.addEventListener("resize", handleResize);

		return () => {
			if (main) {
				resizeObserver.unobserve(main);
			}
			resizeObserver.disconnect();
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	function renderTiles(quantity: number) {
		return Array.from(Array(quantity)).map((tile, index) => {
			return (
				<div
					key={index}
					className="m-[1px] aspect-square bg-[#020817] opacity-75"
					style={{
						width: `${cellSize.width}px`,
						height: `${cellSize.height}px`,
					}}
				/>
			);
		});
	}

	return (
		<div
			className="absolute top-0 z-10 grid h-full w-full overflow-hidden backdrop-blur-[200px]"
			style={{
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				gridTemplateRows: `repeat(${rows}, 1fr)`,
				gridGap: "1fr",
			}}
		>
			{renderTiles(cols * rows)}
		</div>
	);
};

export default Grid;
