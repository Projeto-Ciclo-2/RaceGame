import { config } from "../config/config";

export class CarsAPI {
	private url = config.API_URL;

	
	public async getCars(userId: string): Promise<any> {
		try {
			const apiURL = this.url + `/cars/${userId}`;
			const requestOptions: RequestInit = this.getRequestOptions("GET");
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch (err: any) {
			return { error: true, err };
		}
	}

	public async selectCar( userId: string, carId: number): Promise<any>{
		try{
			const apiURL = this.url + "/cars/user_car";
			const requestOptions: RequestInit = this.getRequestOptions("PUT", {
				userId,
				carId,
			});
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch(err: any) {
			return{ error: true, err}
		}
	}

	private getRequestOptions(
		method:  "GET" | "PUT",
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
