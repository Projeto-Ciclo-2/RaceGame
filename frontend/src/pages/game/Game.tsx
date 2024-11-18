import React from "react";
import { GameController } from "./gameController";
import "./game.css";
import { useWebSocket } from "../../context/WebSocketContext";
import { useRoom } from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { IPlayer, IPlayerMIN } from "../../interfaces/IRoom";
import GameStatus from "./status/GameStatus";
import EndScreen from "../end/EndScreen";

export default function Game() {
	const WebSocketContext = useWebSocket();
	const RoomsContext = useRoom();
	const navigate = useNavigate();

	const [playersStatus, setPlayerStatus] = React.useState<Array<IPlayer | IPlayerMIN>>([]);
	const [gameStatus, setGameStatus] = React.useState(true);
	const me = React.useRef<undefined | IPlayer>(undefined);
	const winner = React.useRef("");

	const gameController = React.useRef<null | GameController>(null);
	const canvas = React.useRef<null | HTMLCanvasElement>(null);

	React.useEffect(() => {
		const can =
			WebSocketContext &&
			WebSocketContext.socket &&
			WebSocketContext.socket.readyState === WebSocket.OPEN;

		const roomCorrect =
			RoomsContext.currentRoom && RoomsContext.currentRoom.id;

		if (!roomCorrect) {
			console.error("there is a error while getting the roomID. sorry.");
			navigate("/home");
			return;
		}

		if (!can && !WebSocketContext.onConnectPromise) {
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
					WebSocketContext.username,
					RoomsContext.currentRoom!.id,
					setPlayerStatus,
					setGameStatus,
					me,
					winner
				);
				gameController.current.start();
			}
		}
		if (WebSocketContext.onConnectPromise && !can) {
			WebSocketContext.onConnectPromise.then(gameInit);
		} else if (can) {
			gameInit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			{!gameStatus && me.current && (
				<EndScreen
					alive={!gameStatus}
					me={me.current}
					winner={winner.current}
					players={playersStatus}
					laps={RoomsContext.currentRoom?.laps}
				/>
			)}
			{gameStatus && (
				<>
					<GameStatus
						players={playersStatus}
						username={WebSocketContext.username}
						laps={RoomsContext.currentRoom?.laps}
					/>
					<canvas ref={canvas} width={760} height={600}></canvas>
				</>
			)}
		</div>
	);
}
