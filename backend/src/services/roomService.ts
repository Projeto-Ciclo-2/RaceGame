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

		room.players.push(player);
		return room;
	}
}
