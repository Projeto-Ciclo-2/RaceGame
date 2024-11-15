import dbConnection from "../database/dbConnection";
import ICar from "./../interfaces/ICar";

class CarRepository {
	async selectUserCar(userId: string, carId: number): Promise<void> {
		await dbConnection("users")
			.where({ id: userId })
			.update({ selected_car: carId });
	}

	async getCars(): Promise<ICar[]> {
		const cars = await dbConnection<ICar>("cars").select(
			"id",
			"name",
			"unlock_requirement"
		);
		return cars;
	}
}

export default CarRepository;
