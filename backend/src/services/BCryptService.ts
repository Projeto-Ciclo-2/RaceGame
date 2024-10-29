import * as bcrypt from "bcryptjs";

export default class BcryptService {
	public static async hash(password: string): Promise<string> {
		return await bcrypt.hash(
			password,
			Number(process.env.BCRYPT_ROUNDS) || 10
		);
	}

	public static async compare(
		password: string,
		hash: string
	): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
