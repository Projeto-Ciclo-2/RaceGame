import UserRepository from "../repositories/userRepository";
import BcryptService from "./BCryptService";
import { UsernameOrPasswordIncorrectException } from "../utils/Exception";
import JwtTokenService from "./JwtTokenService";
import { Message } from "../utils/Message";
import { IGoogleProfile } from "../interfaces/IUser";

export default class AuthService {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	public async login(googleProfile: IGoogleProfile): Promise<string> {
		let user = await this.userRepository.getUserByGoogleId(
			googleProfile.sub
		);

		if (!user) {
			user = await this.userRepository.createUserAndReturnID({
				username: googleProfile.email.split("@")[0],
				name: googleProfile.name,
				google_id: googleProfile.sub,
				picture: googleProfile.picture,
			});
		}

		const token = JwtTokenService.create({ user_id: user.id });

		return token;
	}
}
