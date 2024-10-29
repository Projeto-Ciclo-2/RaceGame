import { Request } from "express";
import { UnauthorizedException } from "./Exception";
import { Message } from "./Message";

export default function AuthorizedNeed(req: Request) {
	if (!req.authUser) {
		throw new UnauthorizedException(Message.UNAUTHORIZED_ACCESS);
	}
	return;
}
