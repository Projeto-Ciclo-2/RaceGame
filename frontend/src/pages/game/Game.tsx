import React from "react";
import { GameController } from "./gameController";
import "./game.css";

export default function Game() {
	const gameController = React.useRef<null | GameController>(null);
	const canvas = React.useRef<null | HTMLCanvasElement>(null);

	React.useEffect(() => {
		if (!gameController.current) {
			if (canvas.current) {
				gameController.current = new GameController(canvas.current);
				gameController.current.start();
			}
		}
	}, []);

	return (
		<div id="game">
			<canvas ref={canvas} width={760} height={600}></canvas>
		</div>
	);
}
