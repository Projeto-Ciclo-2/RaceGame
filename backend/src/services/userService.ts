import { IUser } from "../interfaces/IUser";
import UserRepository from "../repositories/userRepository";
import { ConflictException, NotFoundException } from "../utils/Exception";

import { Message } from "../utils/Message";
import BcryptService from "./BCryptService";

export class UserService {
	private userRepository: UserRepository;
	constructor() {
		this.userRepository = new UserRepository();
	}
	public async createUser(user: Partial<IUser>) {
		return await this.userRepository.createUser(user);
	}
	public async getUserById(id: string) {
		return await this.userRepository.getUserById(id);
	}

	public async getAllUsers() {
		return await this.userRepository.getAllUsers();
	}

	public async delete(id: string) {
		const foundUser = await this.userRepository.getUserById(id);

		if (!foundUser) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}
		return await this.userRepository.delete(id);
	}
	public async update(id: string, user: Partial<IUser>) {
		const foundUser = await this.userRepository.getUserById(id);

		if (!foundUser) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		return await this.userRepository.update(id, user);
	}
}
