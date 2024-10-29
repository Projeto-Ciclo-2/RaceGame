import "ts-node/register";

import dotenv from "dotenv";
import { config as pConfig } from "./src/config";

dotenv.config();

const config = {
	development: {
		client: "pg",
		connection: {
			host: pConfig.DB_HOST,
			user: pConfig.DB_USER,
			password: pConfig.DB_PASSWORD,
			database: pConfig.DB_DATABASE_NAME,
			port: Number(pConfig.DB_PORT),
		},
		migrations: {
			directory: "knex/migrations",
			extension: "ts",
		},
	},
} as const;

export default config;
