import React from "react";
import { GameController } from "./gameController";
import "./game.css";
import { useWebSocket } from "../../context/WebSocketContext";

export default function Game() {
	const WebSocketContext = useWebSocket();
	const gameController = React.useRef<null | GameController>(null);
	const canvas = React.useRef<null | HTMLCanvasElement>(null);

	React.useEffect(() => {
		if(!WebSocketContext.onConnectPromise) {
			return;
		}
		function gameInit() {
			if (
				!gameController.current &&
				canvas.current &&
				WebSocketContext.socket &&
				WebSocketContext.socket.readyState === WebSocket.OPEN &&
				WebSocketContext.username
			) {
				console.log("game init");
				gameController.current = new GameController(
					canvas.current,
					WebSocketContext,
					WebSocketContext.username
				);
				gameController.current.start();
			}
		}
		WebSocketContext.onConnectPromise.then(gameInit);
	}, [
		gameController,
		canvas,
		WebSocketContext,
		WebSocketContext.isConnected,
		WebSocketContext.isConnected,
		WebSocketContext.socket,
	]);

	return (
		<div id="game">
			<canvas ref={canvas} width={760} height={600}></canvas>
		</div>
	);
}
