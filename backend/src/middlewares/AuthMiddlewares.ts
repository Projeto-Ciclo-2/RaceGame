import { NextFunction, Request, Response } from "express";
import { IUserEntity } from "../entities/userEntity";
import JwtTokenService from "../services/JwtTokenService";
import UserRepository from "../repositories/userRepository";
import { NotFoundException, UnauthorizedException } from "../utils/Exception";
import { Message } from "../utils/Message";
import HttpResponse from "../utils/HttpResponse";

declare global {
	namespace Express {
		interface Request {
			authUser: Partial<IUserEntity>;
		}
	}
}

export default async function AuthMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.cookies["token"];

		if (!token) {
			throw new UnauthorizedException(Message.UNAUTHORIZED_ACCESS);
		}

		const tokenVerify = JwtTokenService.verify(token) as {
			user_id: string;
		};

		if (!tokenVerify) {
			throw new UnauthorizedException(Message.JWT_MALFORMATED);
		}

		const user = await new UserRepository().getUserById(
			tokenVerify.user_id
		);

		if (!user) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		req.authUser = user;

		next();
	} catch (error: any) {
		const response = new HttpResponse({
			status: error.statusCode,
			error: error.name,
			message: error.message,
		});

		res.status(response.status).json(response);
	}
}
