import dbConnection from "../database/dbConnection";
import { IUser } from "../interfaces/IUser";

export default class UserRepository {
	public async createUser(user: Partial<IUser>) {
		console.log("user");
		console.log(user);

		const [createdUser] = (await dbConnection("users")
			.insert(user)
			.returning([
				"username",
				"name",
				"google_id",
				"created_at",
				"wins",
				"messages_send",
				"picked_items",
				"played_games",
			])) as IUser[];
		return createdUser;
	}

	public async getUserById(id: string): Promise<IUser | undefined> {
		const user: IUser = await dbConnection<IUser>("users")
			.where({ id })
			.first([
				"id",
				"username",
				"name",
				"created_at",
				"wins",
				"messages_send",
				"picked_items",
				"played_games",
				"selected_car_id",
			]);

		return user;
	}

	public async getAllUsers() {
		const users = await dbConnection<IUser>("users").select([
			"username",
			"name",
			"created_at",
			"wins",
			"messages_send",
			"picked_items",
			"played_games",
		]);

		return users;
	}

	public async getUserByUsername(username: string) {
		const user = await dbConnection<IUser>("users")
			.where({ username })
			.first();
		return user;
	}

	public async getUserByGoogleId(google_id: string) {
		const user = await dbConnection<IUser>("users")
			.where({ google_id })
			.first();
		return user;
	}

	public async update(id: string, user: Partial<IUser>) {
		const [updatedUser] = await dbConnection<IUser>("users")
			.where({ id })
			.update(user)
			.returning([
				"username",
				"name",
				"created_at",
				"wins",
				"messages_send",
				"picked_items",
				"played_games",
			]);
		return updatedUser;
	}

	public async delete(id: string) {
		const [deletedUser] = await dbConnection<IUser>("users")
			.where({ id })
			.del()
			.returning([
				"username",
				"name",
				"created_at",
				"wins",
				"messages_send",
				"picked_items",
				"played_games",
			]);
		return `Usuario ${deletedUser.username} deletado com sucesso!`;
	}
}
