import { Request, Response } from "express";
import CarService from "./../services/carService";
import { BadRequestException } from "../utils/Exception";
import { Message } from "../utils/Message";
import HttpResponse from "../utils/HttpResponse";

class CarController {
	private carService: CarService;

	constructor() {
		this.carService = new CarService();
	}

	public async selectUserCar(req: Request, res: Response): Promise<void> {
		try {
			const { carId, userId } = req.body;

			if (!carId || !userId) {
				throw new BadRequestException(Message.INVALID_USER_OR_CAR);
			}

			await this.carService.selectUserCar(userId, Number(carId));

			res.status(200).json({ message: "Carro selecionado com sucesso!" });
		} catch (error: any) {
			const response = new HttpResponse({
				status: error.statusCode,
				error: error.name,
				message: error.message,
			});
			res.status(response.status).json(response);
		}
	}

	public async getCars(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;

		try {
			const { userId } = req.body;
			if (!userId) {
				throw new BadRequestException(Message.INVALID_ID);
			}
			const result = await this.carService.getCars(userId);

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
}

export default CarController;
