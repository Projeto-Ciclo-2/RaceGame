import { use } from "passport";
import { getPlayer } from "../game/mock/players";
import { IPlayer, IRoom } from "../interfaces/IRoom";

import RoomRepository from "../repositories/roomRepository";
import UserRepository from "../repositories/userRepository";
import { NotFoundException } from "../utils/Exception";
import { Message } from "../utils/Message";

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
			return []
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

		const player: IPlayer = getPlayer(user.id, user.username);

		room.players.push(player);
		return room;
	}
}
