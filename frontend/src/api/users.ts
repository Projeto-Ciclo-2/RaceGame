import { config } from "../config/config";

export class UserAPI {
	private url = config.API_URL;

	public async singIn(name: string, password: string): Promise<any> {
		try {
			const apiURL = this.url + "/users";
			const requestOptions: RequestInit = this.getRequestOptions("POST", {
				name,
				password,
			});
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch (err: any) {
			return { error: true, err };
		}
	}

	public async logIn(name: string, password: string): Promise<any> {
		try {
			const apiURL = this.url + "/login";
			const requestOptions: RequestInit = this.getRequestOptions("POST", {
				name,
				password,
			});
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();

			if (result.statusCode) return result;
			return { statusCode: res.status, result };
		} catch (err) {
			return { error: true, err };
		}
	}

	public async logout(): Promise<any> {
		try {
			const apiURL = this.url + "/logout";
			const requestOptions: RequestInit =
				this.getRequestOptions("DELETE");
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch (err) {
			return { error: true, err };
		}
	}

	public async Ranking(): Promise<any> {
		try {
			const apiURL = this.url + "/users";
			const requestOptions: RequestInit = this.getRequestOptions("GET");
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch (err: any) {
			return { error: true, err };
		}
	}
	public async getMyUser(): Promise<any> {
		try {
			const apiURL = this.url + "/users/me";
			const requestOptions = this.getRequestOptions("GET");
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch (err) {
			return { error: true, err };
		}
	}

	private getRequestOptions(
		method: "POST" | "GET" | "DELETE",
		obj?: object
	): RequestInit {
		const options: RequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include"
		};

		if(method !== "GET" && obj) {
			options.body = JSON.stringify(obj);
		}
		return options;
	}

}
