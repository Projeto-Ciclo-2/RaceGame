import redisClient from "../database/redisClient";
import { carOptions, IMessage, IPlayer, IRoom } from "../interfaces/IRoom";
import { randomUUID } from "crypto";
import { NotFoundException } from "../utils/Exception";
import { Message } from "../utils/Message";
import { IUser } from "../interfaces/IUser";
import Redis from "ioredis";
import { getPlayer } from "../game/mock/players";

export default class RoomRepository {
	private redis: Redis;

	constructor() {
		this.redis = redisClient;
	}

	async createRoom(user: IUser): Promise<IRoom> {
		const player= getPlayer(user.id, user.username, false, user.selected_car_id as carOptions);

		const room: IRoom = {
			id: randomUUID(),
			laps: 3,
			map: 1,
			players: [player],
			messages: [],
			gameInit: false
		};

		await this.redis.set(`room:${room.id}`, JSON.stringify(room));

		return room;
	}

	async deleteRoom(id: string): Promise<void> {
		await this.redis.del(`room:${id}`);
	}

	async updatePlayers(id: string, players: IPlayer[]): Promise<void> {
		const room = await this.getOneRoom(id);
		if (!room) {
			throw new NotFoundException(Message.ROOM_NOT_FOUND);
		}
		room.players = players;

		await this.redis.set(`room:${room.id}`, JSON.stringify(room));
	}

	async updateMessages(id: string, messages: IMessage[]): Promise<void> {
		const room = await this.getOneRoom(id);
		if (!room) {
			throw new NotFoundException(Message.ROOM_NOT_FOUND);
		}
		room.messages = messages;
		await this.redis.set(`room:${id}`, JSON.stringify(room));
	}

	async getOneRoom(id: string): Promise<IRoom | null> {
		const roomData = await this.redis.get(`room:${id}`);

		if (!roomData) {
			throw new NotFoundException(Message.ROOM_NOT_FOUND);
		}

		return JSON.parse(roomData) as IRoom;
	}

	async allRooms(): Promise<IRoom[]> {
		const keys = await this.redis.keys("room:*");
		const rooms = await Promise.all(
			keys.map(async (key) => {
				const roomData = await this.redis.get(key);
				return roomData ? (JSON.parse(roomData) as IRoom) : null;
			})
		);
		return rooms.filter((room) => room !== null) as IRoom[];
	}
}
