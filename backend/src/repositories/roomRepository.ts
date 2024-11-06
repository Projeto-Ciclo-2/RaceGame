import redisClient from "../database/redisClient";
import { IMessage, IPlayer, IRoom } from "../interfaces/IRoom";
import { randomUUID } from "crypto";
import { NotFoundException } from "../utils/Exception";
import { Message } from "../utils/Message";
import { IUser } from "../interfaces/IUser";
import Redis from "ioredis";

export default class RoomRepository {
	private redis: Redis;

	constructor() {
		this.redis = redisClient;
	}

	async createRoom(user: IUser): Promise<IRoom> {
		const player: IPlayer = {
			id: user.id,
			username: user.username,
			ready: false,
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			done_laps: 0,
			done_checkpoints: 0,
			velocities: {
				vx: 0,
				vy: 0,
			},
			items: [],
		};

		const room: IRoom = {
			id: randomUUID(),
			laps: 0,
			map: 1,
			players: [player],
			messages: [],
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
