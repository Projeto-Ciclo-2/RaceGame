import { IUserEntity } from "../entities/userEntity";
import UserRepository from "../repositories/userRepository";
import { ConflictException, NotFoundException } from "../utils/Exception";

import { Message } from "../utils/Message";
import BcryptService from "./BCryptService";

export class UserService {
	private userRepository: UserRepository;
	constructor() {
		this.userRepository = new UserRepository();
	}
	public async createUser(user: Partial<IUserEntity>) {
		if (!user.name) {
			throw new Error(Message.NAME_REQUIRED);
		}
		const foundUser = await this.userRepository.getUserByName(user.name);

		if (foundUser) {
			throw new ConflictException(Message.DUPLICATED_NAME);
		}

		user.password = await BcryptService.hash(String(user.password));

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
	public async update(id: string, user: Partial<IUserEntity>) {
		const foundUser = await this.userRepository.getUserById(id);

		if (!foundUser) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		user.password = await BcryptService.hash(String(user.password));

		return await this.userRepository.update(id, user);
	}
}
