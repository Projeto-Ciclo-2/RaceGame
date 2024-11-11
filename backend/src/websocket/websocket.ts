import { BadRequestException } from "../utils/Exception";
import WebSocket from "ws";
import { Message } from "../utils/Message";
import { UserService } from "../services/userService";
import { IncomingMessage } from "http";
import url from "url";
import {
	WsBroadcastJoinGame,
	WsBroadcastNewMessage,
	WsBroadcastPlayerLeft,
	WsBroadcastPlayerMove,
	WsBroadcastPlayerPickItem,
	WsBroadcastPlayerReady,
	WsBroadcastUseItem,
	WsEndGame,
	WsGameState,
	WsPlayerArrives,
	WsPlayerMove,
	WsPlayerPicksItem,
	WsPlayerUsesItem,
	WsGameInit,
	WsNewRoom,
	WsPlayerArrives,
	WsPlayerMove,
	WsPlayerPicksItem,
	WsPlayerUsesItem,
	WsPlayerLeft,
	WsPlayerReady,
	WsPostMessage,
	WsRequestJoinRoom,
	WsRoomInfo,
} from "../interfaces/IWSMessages";
import RoomService from "../services/roomService";
import { WsUser } from "../interfaces/IUser";
import { RaceGame } from "../game/game";
import { GameService } from "../game/service/gameService";
import { getPlayer } from "../game/mock/players";
import { randomUUID } from "crypto";
import { IUser } from "../interfaces/IUser";
import { LobbySevice } from "../services/lobbyService";
import { IRoom } from "../interfaces/IRoom";

const userService = new UserService();
const roomService = new RoomService();
const users = new Set<WsUser>();
const lobbyService = new LobbySevice();

const raceGame = new RaceGame();
raceGame.addRoom({
	gameService: new GameService([]),
	id: "1234",
	laps: 4,
	map: 1,
	messages: [],
	players: [],
	WsPlayers: [],
	gameInit: false
});

export const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
	const queryParams = url.parse(req.url!, true).query;
	const username = queryParams["username"] as string;

	if (!username) {
		ws.close(1008, "Missing username");
		return;
	}

	for (const user of users) {
		if (user.username === username) {
			ws.close(1000, "user already connected");
			return;
		}
	}

	const thisUser = { username: username, ws: ws };

	users.add(thisUser);
	ws.send(
		JSON.stringify({
			type: "allRooms",
			rooms: await roomService.allRooms(),
		})
	);
	// raceGame._addPlayer(thisUser, getPlayer(randomUUID(), username), "1234");

	ws.on("message", async (message) => {
		const data = JSON.parse(message.toString());

		switch (data.type) {
			case "createRoom":
				try {
					const room = await roomService.createRoom(data.userID);
					const message: WsNewRoom = {
						type: "newRoom",
						room: room,
						creatorUserID: data.userID,
					};
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "requestJoinRoom":
				try {
					const room = await roomService.joinRoom(
						data.userID,
						data.roomID
					);

					const user = room.players.find(
						(user) => user.id === data.userID
					);

					const message: WsBroadcastJoinGame = {
						type: "broadcastJoinGame",
						username: user?.username || "",
						userID: user?.id || "",
						room: room,
					};
					broadcast(JSON.stringify(message));

					const roomInfo: WsRoomInfo = {
						type: "roomInfo",
						room: room,
					};
					broadcast(JSON.stringify(roomInfo));

					const messageChat: WsBroadcastNewMessage = {
						type: "broadcastNewMessage",
						message: {
							content: `${username} entered!`,
							userID: data.userID,
							username: username,
							typeMessageChat: "userJoined",
						},
						roomID: data.roomID,
					};
					broadcast(JSON.stringify(messageChat));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerLeft":
				try {
					const dataWS = data as WsPlayerLeft;
					const updateRoom: IRoom = await lobbyService.playerLeft(
						dataWS
					);

					// Percorrer players para saber se todos estão prontos
					const initGame = updateRoom.players.every(
						(player) => player.ready === true
					); // retorna true(se todos estão prontos) e retorna false(se pelo menos um player não estiver pronto)
					const numberPlayers = updateRoom.players.length;

					// Inciar jogo
					if (initGame && numberPlayers > 1) {
						// Enviar mensagem específica para o usuário que saiu
						const messageExit: WsBroadcastPlayerLeft = {
							type: "broadcastPlayerLeft",
							username: dataWS.username,
							userID: dataWS.userID,
							roomID: dataWS.roomID,
						};
						const userWhoLeft = Array.from(users).find(
							(user) => user.username === dataWS.username
						);
						if (userWhoLeft) {
							userWhoLeft.ws.send(JSON.stringify(messageExit));
						}

						// Retornar room com gameIniti Atualizado
						const room_with_gameInit = updateRoom;
						room_with_gameInit.gameInit = true;
						await lobbyService.saveRedisGameInit(room_with_gameInit) // salvar no redis

						// Atualização front (geral)
						const messageUp: WsRoomInfo = {
							type: "roomInfo",
							room: room_with_gameInit,
						};
						broadcast(JSON.stringify(messageUp));

						// Enviar mensagem `gameInit` para os demais jogadores
						const message: WsGameInit = {
							type: "gameInit",
							roomID: dataWS.roomID,
							started_at: Date.now(),
						};
						broadcast(JSON.stringify(message));
					}

					// Game não iniciado
					if (!initGame) {
						// Atualização do front (looby)
						const message: WsBroadcastPlayerLeft = {
							type: "broadcastPlayerLeft",
							username: dataWS.username,
							userID: dataWS.userID,
							roomID: dataWS.roomID,
						};
						broadcast(JSON.stringify(message));

						// Atualização front (geral)
						const messageUp: WsRoomInfo = {
							type: "roomInfo",
							room: updateRoom,
						};
						broadcast(JSON.stringify(messageUp));

						// Mensagem para o chat informando que o usuário saiu
						const messageChat: WsBroadcastNewMessage = {
							type: "broadcastNewMessage",
							message: {
								content: `${username} saiu`,
								userID: dataWS.userID,
								username: dataWS.username,
								typeMessageChat: "userLeft",
							},
							roomID: dataWS.roomID,
						};
						broadcast(JSON.stringify(messageChat));
					}
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}

				break;
			case "postMessage":
				try {
					const dataWS = data as WsPostMessage;
					const updateRoom = await lobbyService.postMessage(dataWS);

					const message: WsBroadcastNewMessage = {
						type: "broadcastNewMessage",
						message: {
							content: dataWS.message.content,
							username: dataWS.message.username,
							userID: dataWS.message.userID,
							typeMessageChat: "message",
						},
						roomID: dataWS.roomID,
					};
					broadcast(JSON.stringify(message));

					// Atualização front (geral)
					const messageUp: WsRoomInfo = {
						type: "roomInfo",
						room: updateRoom,
					};
					broadcast(JSON.stringify(messageUp));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerReady":
				try {
					const dataWs = data as WsPlayerReady;

					const updateRoom: IRoom = await lobbyService.playerReady(
						dataWs,
						username
					);

					// Percorrer players para saber se todos estão prontos
					const initGame = updateRoom.players.every(
						(player) => player.ready === true
					); // retorna true(se todos estão prontos) e retorna false(se pelo menos um player não estiver pronto)
					const numberPlayers = updateRoom.players.length;

					// Inciar jogo
					if (initGame && numberPlayers > 1) {
						console.log(`user ${dataWs.userID} ficou pronto!`);

						// Retornar room com gameIniti Atualizado
						const room_with_gameInit = updateRoom;
						room_with_gameInit.gameInit = true;
						await lobbyService.saveRedisGameInit(room_with_gameInit) // salvar no redis

						// Atualização front (geral)
						const messageUp: WsRoomInfo = {
							type: "roomInfo",
							room: room_with_gameInit,
						};
						broadcast(JSON.stringify(messageUp));

						const message: WsGameInit = {
							type: "gameInit",
							roomID: dataWs.roomID,
							started_at: Date.now(),
						};
						broadcast(JSON.stringify(message));
					}

					// Jogo não inciado
					if (!initGame) {
						// Atualizar informações no front
						const message: WsBroadcastPlayerReady = {
							type: "broadcastPlayerReady",
							userID: dataWs.userID,
							roomID: dataWs.roomID,
						};
						broadcast(JSON.stringify(message));

						// Atualização front (geral)
						const messageUp: WsRoomInfo = {
							type: "roomInfo",
							room: updateRoom,
						};
						broadcast(JSON.stringify(messageUp));

						// Enviar mensagem no chat
						const message2: WsBroadcastNewMessage = {
							type: "broadcastNewMessage",
							message: {
								content: `${username} is ready!`,
								userID: data.userID,
								username: username,
								typeMessageChat: "userReady",
							},
							roomID: dataWs.roomID,
						};
						broadcast(JSON.stringify(message2));
					}
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerMove":
				try {
					raceGame.queuePlayerMove(data as WsPlayerMove);
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "requestGameState":
				try {
					const room = raceGame.getRoom(data.roomID);
					if (room) {
						const message: WsGameState = {
							type: "gameState",
							entities: room.gameService.getEntities(),
						};
						ws.send(JSON.stringify(message));
					}
					throw new Error(Message.ROOM_NOT_FOUND);
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerPicksItem":
				try {
					raceGame.queuePlayerPickItem(data as WsPlayerPicksItem);
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerUsesItem":
				try {
					raceGame.queuePlayerUsesItem(data as WsPlayerUsesItem);
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerArrives":
				try {
					raceGame.queuePlayerArrives(data as WsPlayerArrives);
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			default:
				throw new BadRequestException(Message.INVALID_TYPE);
		}
	});
	ws.on("close", async () => {
		users.delete(thisUser);

		const user = await userService.getUserByUsername(thisUser.username);

		// todo: Não remover usuário se o jogo tiver iniciado

		// Remover o usuário do lobby
		try {
			if (user) {
				const room = await roomService.getIdRoomUserWasIn(user.id);

				if (room) {
					const roomUpdate = await lobbyService.playerLeft({
						type: "playerLeft",
						username: user.username,
						userID: user?.id,
						roomID: room.id,
					});

					// Verificar se o jogo iniciou
					// Percorrer players para saber se todos estão prontos
					const initGame = roomUpdate.players.every(
						(player) => player.ready === true
					); // retorna true(se todos estão prontos) e retorna false(se pelo menos um player não estiver pronto)
					const numberPlayers = roomUpdate.players.length;

					if (initGame && numberPlayers > 1) {
						// Retornar room com gameIniti Atualizado
						const room_with_gameInit = room;
						room_with_gameInit.gameInit = true;
						await lobbyService.saveRedisGameInit(room_with_gameInit) // salvar no redis

						// Atualização front (geral)
						const messageUp: WsRoomInfo = {
							type: "roomInfo",
							room: room_with_gameInit,
						};
						broadcast(JSON.stringify(messageUp));

						// Enviar mensagem `gameInit` para os demais jogadores
						const message: WsGameInit = {
							type: "gameInit",
							roomID: room.id,
							started_at: Date.now(),
						};
						broadcast(JSON.stringify(message));
					}

					if (!initGame) {
						// Envia uma mensagem de broadcast informando que o usuário saiu
						const message: WsBroadcastPlayerLeft = {
							type: "broadcastPlayerLeft",
							username: thisUser.username,
							userID: user.id,
							roomID: room.id,
						};
						broadcast(JSON.stringify(message));

						// Mensagem de chat para outros jogadores
						const chatMessage: WsBroadcastNewMessage = {
							type: "broadcastNewMessage",
							message: {
								content: `${thisUser.username} saiu do lobby.`,
								userID: user.id,
								username: thisUser.username,
								typeMessageChat: "userLeft",
							},
							roomID: room.id,
						};
						broadcast(JSON.stringify(chatMessage));
					}
				}
			}
		} catch (error) {
			console.error("Erro ao remover usuário do lobby:", error);
		}
	});
});

function sendErr(ws: WebSocket, error?: Error) {
	ws.send(
		JSON.stringify({
			error: error ? error.message : "A internal error happen",
		})
	);
}

function broadcast(data: string): void {
	for (const user of users) {
		user.ws.send(data);
	}
}
