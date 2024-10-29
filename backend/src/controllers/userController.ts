import { Request, Response } from "express";

import { UserService } from "../services/userService";
import HttpResponse from "../utils/HttpResponse";
import { Message } from "../utils/Message";
import { BadRequestException } from "../utils/Exception";
import { IUserEntity } from "../entities/userEntity";

export default class UserController {
	private userService: UserService;
	constructor() {
		this.userService = new UserService();
	}

	public async getMyUser(req: Request, res: Response): Promise<void> {
		try {
			const response = new HttpResponse({
				status: 200,
				data: req.authUser,
			});

			res.status(response.status).json(response);
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});
		}
	}
	public async createUser(req: Request, res: Response): Promise<void> {
		try {
			const { name, password } = req.body;

			if (name.length < 4) {
				throw new BadRequestException(Message.INVALID_NAME);
			}

			if (password.length < 8) {
				throw new BadRequestException(Message.INVALID_PASSWORD);
			}

			if (!name || !password) {
				throw new BadRequestException(
					Message.USERNAME_OR_PASSWORD_INCORRECT
				);
			}

			const user: IUserEntity = req.body;
			const result = await this.userService.createUser(user);

			const response = new HttpResponse({
				status: 201,
				data: result,
			});

			res.status(response.status).json(response);
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});

			res.status(response.status).json(response);
		}
	}

	public async getUserById(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.user_id;

			if (!id) {
				throw new BadRequestException(Message.INVALID_ID);
			}

			const result = await this.userService.getUserById(id);

			const response = new HttpResponse({
				status: 200,
				data: result,
			});

			res.status(response.status).json(response);
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});

			res.status(response.status).json(response);
		}
	}

	public async getUsers(req: Request, res: Response): Promise<void> {
		try {
			const result = await this.userService.getAllUsers();

			const response = new HttpResponse({
				status: 200,
				data: result,
			});

			res.status(response.status).json(response);
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});

			res.status(response.status).json(response);
		}
	}

	public async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.user_id;

			if (!id) {
				throw new BadRequestException(Message.INVALID_ID);
			}

			const { name, password } = req.body;

			if (!name || !password) {
				throw new BadRequestException(
					Message.USERNAME_OR_PASSWORD_INCORRECT
				);
			}

			const result = await this.userService.update(id, req.body);
			const response = new HttpResponse({
				status: 200,
				data: result,
			});

			res.status(response.status).json(response);
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});

			res.status(response.status).json(response);
		}
	}

	public async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.user_id;

			if (!id) {
				throw new BadRequestException(Message.INVALID_ID);
			}
			const result = await this.userService.delete(id);

			res.status(200).json(result);
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
