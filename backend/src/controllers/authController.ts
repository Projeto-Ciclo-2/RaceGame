import { Request, Response } from "express";
import { Message } from "../utils/Message";
import AuthService from "../services/AuthService";
import HttpResponse from "../utils/HttpResponse";

export default class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	public async login(req: Request, res: Response): Promise<void> {
		try {
			const { name, password } = req.body;
			if (!name || !password) {
				throw new Error(Message.USERNAME_OR_PASSWORD_INCORRECT);
			}

			const token = await this.authService.login(name, password);

			res.cookie("token", token, {
                maxAge: 8 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: false
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
