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
		<div className="absolute z-10">
			<div
				className="grid h-screen w-screen overflow-hidden"
				style={{
					gridTemplateColumns: `repeat(${cols}, 1fr)`,
					gridTemplateRows: `repeat(${rows}, 1fr)`,
				}}
			>
				{renderTiles(cols * rows)}
			</div>
		</div>
	);
};

export default Grid;
