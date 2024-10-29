import UserRepository from "../repositories/userRepository";
import BcryptService from "./BCryptService";
import { UsernameOrPasswordIncorrectException } from "../utils/Exception";
import JwtTokenService from "./JwtTokenService";
import { Message } from "../utils/Message";

export default class AuthService {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	public async login(name: string, password: string): Promise<string> {
		const user = await this.userRepository.getUserByName(name);

		if (!user) {
			throw new UsernameOrPasswordIncorrectException(
				Message.USERNAME_OR_PASSWORD_INCORRECT
			);
		}

		if (!(await BcryptService.compare(password, user.password || ""))) {
			throw new UsernameOrPasswordIncorrectException(
				Message.USERNAME_OR_PASSWORD_INCORRECT
			);
		}

		const token = JwtTokenService.create({ user_id: user.id });

		return token;
	}
}
