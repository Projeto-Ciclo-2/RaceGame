import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

interface IJwt {
	user_id: string;
}

export default class JwtTokenService {
	public static verify(token: string) {
		return jwt.verify(token, process.env.JWT || "");
	}

	public static create(data: IJwt) {
		return jwt.sign(data, process.env.JWT || "");
	}
}
