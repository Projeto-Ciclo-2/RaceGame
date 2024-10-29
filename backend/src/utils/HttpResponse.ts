export default class HttpResponse {
	private statusCode: number;
	private data?: object;
	private error?: string;
	private message?: string;

	constructor(httpResponse: {
		status: number;
		data?: object;
		error?: string;
		message?: string;
	}) {
		this.statusCode = httpResponse.status || 500;
		this.data = httpResponse.data;
		this.error = httpResponse.error;
		this.message = httpResponse.message;
	}

	get status(): number {
		return this.statusCode;
	}
}
