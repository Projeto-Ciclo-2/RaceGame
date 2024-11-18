import { use } from "passport";
import { getPlayer } from "../game/mock/players";
import { carOptions, IPlayer, IRoom } from "../interfaces/IRoom";

import RoomRepository from "../repositories/roomRepository";
import UserRepository from "../repositories/userRepository";
import { NotFoundException } from "../utils/Exception";
import { Message } from "../utils/Message";
import redisClient from "../database/redisClient";

export default class RoomService {
	private userRepository: UserRepository;
	private roomRepository: RoomRepository;
	constructor() {
		this.userRepository = new UserRepository();
		this.roomRepository = new RoomRepository();
	}
	async createRoom(userID: string): Promise<IRoom> {
		const user = await this.userRepository.getUserById(userID);
		if (!user) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		const newRoom = await this.roomRepository.createRoom(user);

		return newRoom;
	}

	async allRooms() {
		try {
			return this.roomRepository.allRooms();
		} catch (error) {
			console.log(error);
			return [];
		}
	}

	async joinRoom(userID: string, roomID: string): Promise<IRoom> {
		const user = await this.userRepository.getUserById(userID);
		const room = await this.roomRepository.getOneRoom(roomID);

		if (!user) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		if (!room) {
			throw new NotFoundException(Message.ROOM_NOT_FOUND);
		}

		if (room.players.length === 10) {
			throw new NotFoundException(Message.ROOM_FULL);
		}

		const player: IPlayer = getPlayer(
			user.id,
			user.username,
			false,
			user.selected_car_id as carOptions
		);

		room.players.push(player);

		// Salvar alteração no redis
		await redisClient.set(`room:${room.id}`, JSON.stringify(room));

		return room;
	}

	async getIdRoomUserWasIn(playerId: string): Promise<IRoom | null> {
		const rooms = await this.allRooms();

		for (const room of rooms) {
			const playerFound = room.players.some(
				(player) => player.id === playerId
			);
			if (playerFound) {
				return room; // Retorna o ID da sala se o jogador estiver nela
			}
		}
		return null; // Retorna null se o jogador não estiver em nenhuma sala
	}

	public async deleteRoom(roomID: string) {
		this.roomRepository.deleteRoom(roomID);
	}
}
