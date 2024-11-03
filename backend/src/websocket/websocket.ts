import { BadRequestException, NotFoundException } from "../utils/Exception";
import WebSocket from "ws";
import { Message } from "../utils/Message";

import { config } from "../config";
import { UserService } from "../services/userService";
import { IncomingMessage } from "http";
import url from "url";
import { WsBroadcastPlayerMove } from "../interfaces/IWSMessages";

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
