import React from "react";
import { GameController } from "./gameController";
import "./game.css";
import { useWebSocket } from "../../context/WebSocketContext";

export default function Game() {
	const WebSocketContext = useWebSocket();
	const gameController = React.useRef<null | GameController>(null);
	const canvas = React.useRef<null | HTMLCanvasElement>(null);

	React.useEffect(() => {
		if (
			!gameController.current &&
			canvas.current &&
			WebSocketContext.isConnected.current &&
			WebSocketContext.socket &&
			WebSocketContext.username
		) {
			gameController.current = new GameController(
				canvas.current,
				WebSocketContext,
				WebSocketContext.username
			);
			gameController.current.start();
		}
	}, [gameController, canvas, WebSocketContext]);

	return (
		<div id="game">
			<canvas ref={canvas} width={760} height={600}></canvas>
		</div>
	);
}
