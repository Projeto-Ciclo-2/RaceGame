import { BadRequestException } from "../utils/Exception";
import WebSocket from "ws";
import { Message } from "../utils/Message";
import { UserService } from "../services/userService";
import { IncomingMessage } from "http";
import url from "url";
import {
	WsBroadcastNewMessage,
	WsBroadcastPlayerLeft,
	WsBroadcastPlayerMove,
	WsBroadcastPlayerPickItem,
	WsBroadcastPlayerReady,
	WsBroadcastUseItem,
	WsEndGame,
	WsNewRoom,
	WsRoomInfo,
} from "../interfaces/IWSMessages";

const userService = new UserService();
const users = new Set<WsUser>();

interface WsUser {
	username: string;
	ws: WebSocket;
}

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

	ws.on("message", async (message) => {
		const data = JSON.parse(message.toString());
		switch (data.type) {
			case "playerMove":
				try {
					const message: WsBroadcastPlayerMove = {
						player: {
							done_checkpoints: 0,
							done_laps: 0,
							height: 30,
							id: "",
							items: [],
							ready: true,
							username: "",
							velocities: {
								vx: 0,
								vy: 0,
							},
							width: 30,
							x: 0,
							y: 0,
						},
						roomID: "",
						type: "broadcastPlayerMove",
					};
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "createRoom":
				try {
					const message: WsNewRoom = {
						type: "newRoom",
						room: {
							id: "",
							laps: 0,
							map: 1,
							players: [],
							messages: [],
						},
					};
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "requestJoinRoom": // executa join game junto?
				try {
					const message: WsRoomInfo = {
						type: "roomInfo",
						room: {
							id: "",
							laps: 0,
							map: 1,
							players: [],
							messages: [],
						},
					};
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
			case "playerPicksItem":
				try {
					const message: WsBroadcastPlayerPickItem = {
						type: "broadcastPlayerPickItem",
						userID: "",
						roomID: "",
						itemID: "",
					};
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerUsesItem":
				try {
					const message: WsBroadcastUseItem = {
						type: "broadcastUseItem",
						userID: "",
						roomID: "",
						itemID: "",
					};
					broadcast(JSON.stringify(message));
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "playerArrives":
				try {
					//refactor: if para verificar quantidade de voltas
					const message: WsEndGame = {
						type: "endGame",
						roomID: "",
						players: [],
						winner: "",
					};
					broadcast(JSON.stringify(message));
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
