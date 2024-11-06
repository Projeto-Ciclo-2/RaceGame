import { error } from "console";
import redisClient from "../database/redisClient";
import { IPlayer, IRoom } from "../interfaces/IRoom";
import {
	WsPlayerLeft,
	WsPlayerReady,
	WsPostMessage,
	WsRequestJoinRoom,
} from "../interfaces/IWSMessages";

export class LobbySevice {
	public async postMessage(data: WsPostMessage) {
		try {
			const room: IRoom = await this.getRoomID(data.roomID);

			// Atualizar mensagens
			room.messages.push(data.message);

			// Armazenar novas mensages
			await redisClient.set(`room:${data.roomID}`, JSON.stringify(room));
			console.log(`Mensagens da room:${data.roomID} atualizadas...`);
		} catch (error) {
			console.log("erro ao atualizar mensagens...", error);
		}
	}

	public async joinRoom(
		data: WsRequestJoinRoom,
		username: string
	): Promise<IRoom> {
		try {
			const room: IRoom = await this.getRoomID(data.roomID);

			let playersID = [];

			for (let i = 0; i < room.players.length; i++) {
				playersID.push(room.players[i].id);
			}

			if (playersID.includes(data.userID)) {
				console.log(`usuário ${username} já está no lobby!`);
			}

			if (!playersID.includes(data.userID)) {
				const newPlayer = this.createBasicPlayer(data.userID, username);
				// adicionar player
				room.players.push(newPlayer);

				// armazenar no redis
				await redisClient.set(
					`room:${data.roomID}`,
					JSON.stringify(room)
				);
			}

			return room;
		} catch (error) {
			throw error;
		}
	}

	public async playerReady(
		data: WsPlayerReady,
		username: string
	): Promise<IRoom> {
		try {
			const room: IRoom = await this.getRoomID(data.roomID);

			const index = room.players.findIndex(
				(player) => player.id === data.userID
			);

			if (index === -1) {
				throw new Error("User does not belong to this room");
			}

			// Player "pronto"
			room.players[index].ready = true;

			// Adiciona mensagem de player pronto
			room.messages.push({
				content: `${username} is ready!`,
				userID: data.userID,
				username: username,
			});

			// Salvar alteração no redis
			await redisClient.set(`room:${data.roomID}`, JSON.stringify(room));

			return room;
		} catch (error) {
			throw error;
		}
	}

	public async playerLeft(data: WsPlayerLeft): Promise<IRoom> {
		try {
			const room: IRoom = await this.getRoomID(data.roomID);

			const players = new Set(room.players);

			for (const player of players) {
				if (player.id === data.userID) {
					players.delete(player);
					break;
				}
			}

			// Atualizar players
			room.players = Array.from(players);

			// Salvar altrações no redis
			await redisClient.set(`room:${data.roomID}`, JSON.stringify(room));

			return room;
		} catch (error) {
			throw error;
		}
	}

	private async getRoomID(roomID: string) {
		try {
			const roomKey = `room:${roomID}`;
			const roomInfo = await redisClient.get(roomKey);
			if (!roomInfo) {
				throw new Error("The room with the given ID was not found!");
			}
			return JSON.parse(roomInfo);
		} catch (error) {
			console.error("Error searching for room in Redis: ", error);
			throw error;
		}
	}

	private createBasicPlayer(id: string, username: string): IPlayer {
		const newPlayer: IPlayer = {
			id: id,
			username: username,
			ready: false,
			x: 0,
			y: 0,
			width: 50,
			height: 50,
			done_laps: 0,
			done_checkpoints: 0,
			velocities: {
				vx: 0,
				vy: 0,
			},
			items: [],
		};

		return newPlayer;
	}
}
