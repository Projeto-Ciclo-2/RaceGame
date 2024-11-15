import CarRepository from "./../repositories/carRepository";
import ICar from "./../interfaces/ICar"; // Certifique-se de ajustar o caminho conforme necessário
import { IUser } from "../interfaces/IUser";
import { NotFoundException } from "../utils/Exception";
import { Message } from "../utils/Message";
import UserRepository from "../repositories/userRepository";

class CarService {
	private carRepository: CarRepository;
	private userRepository: UserRepository;

	constructor() {
		this.carRepository = new CarRepository();
		this.userRepository = new UserRepository();
	}

	async selectUserCar(userId: string, carId: number): Promise<void> {
		await this.carRepository.selectUserCar(userId, carId);
	}

	async getCars(userId: string): Promise<ICar[]> {
		const user = await this.userRepository.getUserById(userId);

		if (!user) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		let unlockedCars = await this.carRepository.getCars();

		if (user.wins >= 1) {
			unlockedCars = unlockedCars.filter((car) => car.id <= 8);
			return unlockedCars;
		}

		if (user.played_games >= 1) {
			unlockedCars = unlockedCars.filter((car) => car.id <= 6);
			return unlockedCars;
		}

		unlockedCars = unlockedCars.filter((car) => car.id <= 3);

		return unlockedCars;
	}
}

export default CarService;
