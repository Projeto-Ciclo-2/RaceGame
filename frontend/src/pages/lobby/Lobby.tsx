/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import "./Lobby.css";
import InputEmojiComponent from "../../components/InputEmoji/InputEmoji";
import { useRoom } from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";
import Btn from "../../components/other/button";
import { useWebSocket } from "../../context/WebSocketContext";
import { WsPlayerLeft, WsPlayerReady } from "../../interfaces/IWSMessages";
import { UserContext } from "../../context/UserContext";
import { WaitingSoundController } from "../../sound/waitingController";
import MusicIcon from "../../components/icons/musicIcon";
import MusicDisabled from "../../components/icons/musicDisabled";

const Lobby = () => {
	const userContext = useContext(UserContext);
	const RoomsContext = useRoom();
	const WebsocketContext = useWebSocket();

	const chatRef = useRef<HTMLDivElement | null>(null);

	const soundController = useRef(new WaitingSoundController());
	soundController.current.playItsWaitingTime();
	const [isPlaying, setIsPlaying] = useState(false);

	const [buttonReadyDisabled, setButtonReadyDisabled] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight + 10;
		}
		if (RoomsContext.initGame) {
			soundController.current.stopItsWaitingTime();
			navigate("/game");
		}
	}, [
		RoomsContext.messages,
		RoomsContext.initGame,
		RoomsContext.players,
		RoomsContext.playersReady,
	]);

	useEffect(() => {
		if (RoomsContext.currentRoom) {
			RoomsContext.updateRoomLobby(RoomsContext.currentRoom);
		}
		if (!userContext?.user.current) {
			soundController.current.stopItsWaitingTime();
			navigate("/home");
		}
	}, []);

	useEffect(() => {
		console.log("current room update");
	}, [RoomsContext.currentRoom]);

	function isReady() {
		const message: WsPlayerReady = {
			type: "playerReady",
			roomID: RoomsContext.currentRoom?.id as string,
			userID: userContext?.user?.current?.id as string,
		};
		WebsocketContext.sendPlayerReady(message);

		setButtonReadyDisabled(true);
	}

	function LeaveTheGame() {
		const message: WsPlayerLeft = {
			type: "playerLeft",
			username: userContext?.user?.current?.username as string,
			roomID: RoomsContext.currentRoom?.id as string,
			userID: userContext?.user?.current?.id as string,
		};
		WebsocketContext.sendPlayerLeft(message);

		soundController.current.stopItsWaitingTime();
		navigate("/home");
	}

	function toggleMusic() {
		setIsPlaying(!isPlaying);
		soundController.current.changeActiveState(isPlaying);
	}

	return (
		<section id="lobby">
			<section id="content-lobby">
				<div id="content-game">
					<div id="status-game">
						<p>
							Players:{" "}
							<span>{RoomsContext.players.length} / 10</span>
						</p>
						<p>
							Players Ready:{" "}
							<span>
								{RoomsContext.playersReady.length} /{" "}
								{RoomsContext.players.length < 3
									? "2"
									: RoomsContext.players.length}
							</span>
						</p>
					</div>
					<p className="alert-game-init">
						The game will start as soon as everyone is ready 🏁
					</p>
					<div id="image-lobby"></div>
					<div id="last-div">
						<hr />
						<div>
							<button id="musicBtn" onClick={toggleMusic}>
								{isPlaying ? <MusicDisabled /> : <MusicIcon />}
							</button>
							{buttonReadyDisabled ? (
								<Btn
									type="button"
									text="I'm ready"
									id="ready"
									className="ready-disabled"
									disabled={true}
								/>
							) : (
								<Btn
									type="button"
									text="I'm ready"
									id="ready"
									onClick={() => isReady()}
								/>
							)}

							<Btn
								type="button"
								text="Leave the game"
								id="leave"
								onClick={() => LeaveTheGame()}
							/>
						</div>
					</div>
				</div>
				<div id="chat-lobby">
					<div id="chat" ref={chatRef}>
						{RoomsContext.messages.map((message, index) => (
							<p key={index}>
								{/* Verifica se é uma mensagem simples */}
								{message.typeMessageChat === "message" && (
									<>
										{/* Verifica se o usuário atual é o autor da mensagem */}
										{userContext?.user?.current?.id ===
										message.userID ? (
											<>
												<span className="author-message">
													<span>
														{message.content}
													</span>
												</span>
											</>
										) : (
											<>
												<span className="name-user">
													{message.username}
												</span>
												{message.content}
											</>
										)}
									</>
								)}

								{/* Mensagem informando que o player entrou na "room" */}
								{message.typeMessageChat === "userJoined" && (
									<span className="user-joined">
										<span>{message.content}</span>
									</span>
								)}

								{/* Mensagem informando que o player está pronto */}
								{message.typeMessageChat === "userReady" && (
									<span className="user-ready">
										<span>{message.content} 🏁</span>
									</span>
								)}

								{/* Mensgaem informando que o player saiu */}
								{message.typeMessageChat === "userLeft" && (
									<span className="user-left">
										<span>{message.content}</span>
									</span>
								)}
							</p>
						))}
					</div>
					<hr />
					<div id="div-input">
						<InputEmojiComponent />
					</div>
				</div>
			</section>
		</section>
	);
};

export default Lobby;
