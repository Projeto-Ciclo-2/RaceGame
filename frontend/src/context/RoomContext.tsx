import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { IMessage, IRoom } from "../interfaces/IRoom";
import { useWebSocket } from "./WebSocketContext";
import { UserContext } from "./UserContext";

interface IRoomContextType {
	rooms: IRoom[] | [];
	setRooms: (rooms: Array<IRoom>) => void;
	currentRoom: IRoom | null;
	setCurrentRoom: (room: IRoom | null) => void;
	updateRoomLobby: (room: IRoom) => void;
	messages: IMessage[];
	setMessages: (message: IMessage[]) => void;
	players: string[];
	playersReady: string[];
	initGame: boolean;
	playerInRoom: boolean;
}

const RoomContext = createContext<IRoomContextType | null>(null);

export const RoomProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [rooms, setRooms] = useState<IRoom[]>([]);
	const [currentRoom, setCurrentRoom] = useState<IRoom | null>(null);

	// Menssagens
	const [messages, setMessages] = useState<IMessage[]>([]);

	// Players Room
	const [players, setPlayers] = useState<string[]>([]);
	const [playersReady, setPlayersReady] = useState<string[]>([]);

	// Player já está em uma room?
	const [playerInRoom, setPlayerInRoom] = useState(false);

	// Init Game
	const [initGame, setInitGame] = useState(false);

	const userContext = useContext(UserContext);

	function updateRoomLobby(room: IRoom) {
		setCurrentRoom(room);

		const arrayPlayers: string[] = [];
		const arrayPlayersReady: string[] = [];

		room.players.forEach((player) => {
			arrayPlayers.push(player.id);
			if (player.ready) {
				arrayPlayersReady.push(player.id);
			}
		});

		setPlayers(arrayPlayers);
		setPlayersReady(arrayPlayersReady);
		setMessages(room.messages);
		setInitGame(false);
	}

	function checkUserRoom(rooms: IRoom[]) {
		rooms.forEach((room) => {
			const playerInRoom = room.players.find(
				(p) => userContext?.user?.current?.id === p.id
			);
			if (playerInRoom) {
				setCurrentRoom(room);
				setPlayerInRoom(true);
			}
		});
	}

	const websocketContext = useWebSocket();

	useEffect(() => {
		websocketContext.onReceiveAllRooms((e) => {
			setRooms(e.rooms);
			checkUserRoom(e.rooms);
		});
		websocketContext.onReceiveNewRoom((e) => {
			const roomsArray = rooms;
			roomsArray.push(e.room);
			setRooms(roomsArray);
			if (e.creatorUserID === userContext?.user?.current?.id) {
				setCurrentRoom(e.room);
			}
		});
		websocketContext.onReceiveNewMessage((e) => {
			setMessages((prevMessages) => {
				return [...prevMessages, e.message];
			});
		});
		websocketContext.onReceivePlayerReady((e) => {
			// Atualizar a lista de salas (rooms)
			setRooms((prevRooms) => {
				return prevRooms.map((room) => {
					if (room.id === e.roomID) {
						// Atualiza o jogador dentro da sala
						const updatedPlayers = room.players.map((player) => {
							if (player.id === e.userID) {
								return { ...player, ready: true }; // Atualiza o jogador
							}
							return player;
						});
						return { ...room, players: updatedPlayers }; // Retorna a sala atualizada
					}
					return room;
				});
			});

			// Atualizar o currentRoom
			if (currentRoom?.id === e.roomID) {
				setCurrentRoom((prevRoom) => {
					if (prevRoom) {
						const updatedPlayers = prevRoom.players.map(
							(player) => {
								if (player.id === e.userID) {
									return { ...player, ready: true }; // Atualiza o jogador
								}
								return player;
							}
						);
						return { ...prevRoom, players: updatedPlayers }; // Retorna a sala atualizada
					}
					return prevRoom; // Se currentRoom for null, retorna null
				});
			}

			// Atualizar o playersReady
			setPlayersReady((prevReadyPlayers) => {
				// Adiciona o playerID ao playersReady, se ainda não estiver lá
				if (!prevReadyPlayers.includes(e.userID)) {
					return [...prevReadyPlayers, e.userID];
				}
				return prevReadyPlayers;
			});
		});
		websocketContext.onReceiveGameInit((e) => {
			if (currentRoom?.id === e.roomID) {
				setInitGame(true);
			}
		});
		websocketContext.onReceiveRoomInfo((e) => {
			// Atualizar a lista de salas (rooms) usando o valor anterior
			setRooms((prevRooms) => {
				return prevRooms.map((room) => {
					if (room.id === e.room.id) {
						return { ...e.room }; // Retorna a sala atualizada com os dados de `e.room`
					}
					return room;
				});
			});

			// Atualizar o currentRoom se for a sala que recebemos no evento
			setCurrentRoom((prevCurrentRoom) => {
				if (prevCurrentRoom?.id === e.room.id) {
					return { ...e.room }; // Atualiza currentRoom com os dados de e.room
				}
				return prevCurrentRoom; // Se não for a mesma sala, mantém o estado atual de currentRoom
			});

			// Atualizar players e playersReady conforme a nova lista de jogadores na sala e.room
			if (e.room.id === currentRoom?.id) {
				const updatedPlayers = e.room.players.map(
					(player) => player.id
				);
				const updatedPlayersReady = e.room.players
					.filter((player) => player.ready)
					.map((player) => player.id);

				setPlayers(updatedPlayers);
				setPlayersReady(updatedPlayersReady);
			}
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [websocketContext]);

	return (
		<RoomContext.Provider
			value={{
				rooms,
				setRooms,
				currentRoom,
				setCurrentRoom,
				updateRoomLobby,
				messages,
				setMessages,
				initGame,
				players,
				playersReady,
				playerInRoom
			}}
		>
			{children}
		</RoomContext.Provider>
	);
};

export function useRoom() {
	const context = useContext(RoomContext);
	if (!context) {
		throw new Error("Context is type undefined");
	}
	return context;
}
