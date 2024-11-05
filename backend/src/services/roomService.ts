import { IRoom } from "../interfaces/IRoom";

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
		console.log("service");
		const user = await this.userRepository.getUserById(userID);
		if (!user) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		const newRoom = await this.roomRepository.createRoom(user);
		return newRoom;
	}
}
