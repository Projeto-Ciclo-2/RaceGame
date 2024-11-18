import React, { useContext } from "react";
import { GameController } from "./gameController";
import "./game.css";
import { useWebSocket } from "../../context/WebSocketContext";
import { useRoom } from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { IPlayer, IPlayerMIN } from "../../interfaces/IRoom";
import GameStatus from "./status/GameStatus";
import EndScreen from "../end/EndScreen";
import { UserContext } from "../../context/UserContext";
import { SoundController } from "../../sound/soundController";
import MusicDisabled from "../../components/icons/musicDisabled";
import MusicIcon from "../../components/icons/musicIcon";
import GiveUp from "../../components/icons/giveUp";
import Confirmation from "../../components/modal/Confirmation";
import Tips from "../../components/svg/tips";
import CloseIcon from "@mui/icons-material/Close";

export default function Game() {
	const WebSocketContext = useWebSocket();
	const RoomsContext = useRoom();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const [playersStatus, setPlayerStatus] = React.useState<
		Array<IPlayer | IPlayerMIN>
	>([]);
	const [gameStatus, setGameStatus] = React.useState(true);
	const me = React.useRef<undefined | IPlayer>(undefined);
	const winner = React.useRef("");

	const gameController = React.useRef<null | GameController>(null);
	const soundController = React.useMemo(() => {
		return new SoundController();
	}, []);
	const canvas = React.useRef<null | HTMLCanvasElement>(null);

	const [isPlaying, setIsPlaying] = React.useState(false);
	const [wantGiveUp, setWantGiveUp] = React.useState(false);
	const [alreadySee, setAlreadySee] = React.useState(false);

	function toggleMusic() {
		setIsPlaying(!isPlaying);
		soundController.changeActiveState(isPlaying);
	}

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

		if (
			!userContext ||
			!userContext.user ||
			!userContext.user.current ||
			!userContext.user.current.id
		) {
			console.error("user not found");
			navigate("/home");
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
					soundController,
					WebSocketContext.username,
					userContext!.user.current!.id,
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
					{wantGiveUp && (
						<Confirmation
							title="Are you sure?"
							description="If you accept you will not be able to join again!"
							onConfirm={() => {
								if (RoomsContext) {
									RoomsContext.reset();
								}
								soundController.stopAcceleration();
								soundController.stopItsRaceTime();
								soundController.stopNitro();
								navigate("/home");
							}}
							onReject={() => setWantGiveUp(false)}
						/>
					)}
					<button id="giveUp" onClick={() => setWantGiveUp(true)}>
						To give up
						<GiveUp />
					</button>
					<button id="musicBtnGameScreen" onClick={toggleMusic}>
						{isPlaying ? <MusicDisabled /> : <MusicIcon />}
					</button>
					<GameStatus
						players={playersStatus}
						username={WebSocketContext.username}
						laps={RoomsContext.currentRoom?.laps}
					/>
					<canvas ref={canvas} width={760} height={600}></canvas>
					{!alreadySee && (
						<figure id="tipsContainer">
							<button
								onClick={() => setAlreadySee(true)}
								className="reject-button"
							>
								<CloseIcon />
							</button>
							<Tips />
						</figure>
					)}
				</>
			)}
		</div>
	);
}
