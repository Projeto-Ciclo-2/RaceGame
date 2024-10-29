class Exception extends Error {
	private statusCode: number;
	constructor(exception: {
		name: string;
		error: string;
		statusCode: number;
	}) {
		super(exception.error);
		this.name = exception.name;
		this.message = exception.error;
		this.statusCode = exception.statusCode;
	}
}

export class InternalServerException extends Exception {
	constructor() {
		super({
			name: "InternalServerException",
			error: "Erro do servidor",
			statusCode: 500,
		});
	}
}

export class BadRequestException extends Exception {
	constructor(error: string) {
		super({
			name: "BadRequestException",
			error: error,
			statusCode: 400,
		});
	}
}

export class UnauthorizedException extends Exception {
	constructor(error: string) {
		super({
			name: "UnauthorizedException",
			error: error,
			statusCode: 401,
		});
	}
}

export class NotFoundException extends Exception {
	constructor(error: string) {
		super({
			name: "NotFoundException",
			error: error,
			statusCode: 404,
		});
	}
}

export class ConflictException extends Exception {
	constructor(error: string) {
		super({
			name: "ConflictException",
			error: error,
			statusCode: 409,
		});
	}
}

export class ForbiddenException extends Exception {
	constructor(error: string) {
		super({
			name: "ForbiddenException",
			error: error,
			statusCode: 403,
		});
	}
}

export class UsernameOrPasswordIncorrectException extends Exception {
	constructor(error: string) {
		super({
			name: "UsernameOrPasswordIncorrectException",
			error: error,
			statusCode: 401,
		});
	}
}

export class ErrorWhileGeneratingQuiz extends Exception {
	constructor(error: string) {
		super({
			name: "ErrorWhileGeneratingQuiz",
			error: error,
			statusCode: 500
		})
	}
}
