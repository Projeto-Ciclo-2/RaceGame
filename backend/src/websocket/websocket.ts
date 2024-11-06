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
	WsNewRoom,
	WsPlayerArrives,
	WsPlayerMove,
	WsPlayerPicksItem,
	WsPlayerUsesItem,
	WsRoomInfo,
} from "../interfaces/IWSMessages";
import RoomService from "../services/roomService";
import { WsUser } from "../interfaces/IUser";
import { RaceGame } from "../game/game";
import { GameService } from "../game/service/gameService";
import { getPlayer } from "../game/mock/players";
import { randomUUID } from "crypto";
import { IUser } from "../interfaces/IUser";

const userService = new UserService();
const roomService = new RoomService();
const users = new Set<WsUser>();

const raceGame = new RaceGame();
raceGame.addRoom({
	gameService: new GameService([]),
	id: "1234",
	laps: 4,
	map: 1,
	messages: [],
	players: [],
	WsPlayers: [],
});

export const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
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
	raceGame._addPlayer(thisUser, getPlayer(randomUUID(), username), "1234");

	ws.on("message", async (message) => {
		const data = JSON.parse(message.toString());

		switch (data.type) {
			case "createRoom":
				try {
					const room = await roomService.createRoom(data.userID);
					const message: WsNewRoom = {
						type: "newRoom",
						room: {
							id: room.id,
							laps: room.laps,
							map: room.map,
							players: room.players,
							messages: room.messages,
						},
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
						room: {
							id: room.id,
							laps: room.laps,
							map: room.map,
							players: room.players,
							messages: room.messages,
						},
					};

					const rommInfo: WsRoomInfo = {
						type: "roomInfo",
						room: {
							id: room.id,
							laps: room.laps,
							map: room.map,
							players: room.players,
							messages: room.messages,
						},
					};
					ws.send(JSON.stringify(rommInfo));
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerLeft":
				try {
					const message: WsBroadcastPlayerLeft = {
						type: "broadcastPlayerLeft",
						username: "",
						userID: "",
						roomID: "",
					};
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}

				break;
			case "postMessage":
				try {
					const message: WsBroadcastNewMessage = {
						type: "broadcastNewMessage",
						message: { content: "", username: "", userID: "" },
						roomID: "",
					};
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerReady":
				try {
					const message: WsBroadcastPlayerReady = {
						type: "broadcastPlayerReady",
						userID: "",
						roomID: "",
					};
					broadcast(JSON.stringify(message));
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
	ws.on("close", () => {
		users.delete(thisUser);
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
