import { IUserEntity } from "../entities/userEntity";
import dbConnection from "../database/dbConnection";

export default class UserRepository {
	public async createUser(user: Partial<IUserEntity>) {
		const [createdUser] = (await dbConnection("users")
			.insert(user)
			.returning([
				"name",
				"created_at",
				"wins",
				"points",
				"medals",
				"played_polls",
			])) as IUserEntity[];
		return createdUser;
	}

	public async getUserById(id: string): Promise<IUserEntity | undefined> {
		const user = await dbConnection<IUserEntity>("users")
			.where({ id })
			.first([
				"id",
				"name",
				"created_at",
				"wins",
				"points",
				"medals",
				"played_polls",
			]);

		return user;
	}

	public async getAllUsers() {
		const users = await dbConnection<IUserEntity>("users").select([
			"name",
			"created_at",
			"wins",
			"points",
			"medals",
			"played_polls",
		]);

		return users;
	}

	public async getUserByName(name: string) {
		const user = await dbConnection<IUserEntity>("users")
			.where({ name })
			.first();
		return user;
	}

	public async update(id: string, user: Partial<IUserEntity>) {
		const [updatedUser] = await dbConnection<IUserEntity>("users")
			.where({ id })
			.update(user)
			.returning([
				"name",
				"created_at",
				"wins",
				"points",
				"medals",
				"played_polls",
			]);
		return updatedUser;
	}

	public async delete(id: string) {
		const [deletedUser] = await dbConnection<IUserEntity>("users")
			.where({ id })
			.del()
			.returning([
				"name",
				"created_at",
				"wins",
				"points",
				"medals",
				"played_polls",
			]);
		return `Usuario ${deletedUser.name} deletado com sucesso!`;
	}
}
