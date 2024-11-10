import { Request, Response } from "express";
import { Message } from "../utils/Message";
import HttpResponse from "../utils/HttpResponse";
import AuthService from "../services/AuthService";
import { IGoogleProfile } from "../interfaces/IUser";

export default class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	public async login(req: Request, res: Response): Promise<void> {
		try {
			const googleProfile: IGoogleProfile = req.body;

			const token = await this.authService.login(googleProfile);
			res.cookie("token", token, {
				maxAge: 8 * 60 * 60 * 1000,
				httpOnly: true,
				sameSite: "strict",
				secure: false,
			});

			res.status(200).json({ message: Message.LOGIN_SUCCESS });
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});

			res.status(response.status).json(response);
		}
	}

	public async logout(_req: Request, res: Response): Promise<void> {
		try {
			res.clearCookie("token");

			res.status(200).json({ message: Message.LOGOUT_SUCCESS });
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});

			res.status(response.status).json(response);
		}
	}
}
