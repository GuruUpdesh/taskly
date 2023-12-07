"use client";

import React, { useState, useEffect } from "react";

const Grid = () => {
	const [cols, setCols] = useState(0);
	const [rows, setRows] = useState(0);

	useEffect(() => {
		function handleResize() {
			const size = 160;
			setCols(Math.floor(document.body.clientWidth / size));
			setRows(Math.floor(document.body.clientHeight / size));
		}

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	function renderTiles(quantity: number) {
		return Array.from(Array(quantity)).map((tile, index) => {
			return <div key={index} className="m-[1px] bg-background" />;
		});
	}

	return (
		<div
			className="absolute grid h-full w-full overflow-hidden z-10 bg-muted dark:bg-muted/25 top-0"
			style={{
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				gridTemplateRows: `repeat(${rows}, 1fr)`,
			}}
		>
			{renderTiles(cols * rows)}
		</div>
	);
};

export default Grid;
