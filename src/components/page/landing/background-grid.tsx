"use client";

import React, { useState, useEffect } from "react";

const Grid = () => {
	const [cols, setCols] = useState(0);
	const [rows, setRows] = useState(0);

	useEffect(() => {
		function handleResize() {
			const size = 130;
			setCols(Math.floor(document.body.clientWidth / size));
			setRows(Math.floor(document.documentElement.scrollHeight / size));
		}

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	function renderTiles(quantity: number) {
		return Array.from(Array(quantity)).map((tile, index) => {
			return (
				<div
					key={index}
					className="m-[1px] aspect-square bg-background opacity-75"
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
			}}
		>
			{renderTiles(cols * rows)}
		</div>
	);
};

export default Grid;
