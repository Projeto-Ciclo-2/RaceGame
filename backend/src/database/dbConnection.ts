import knex from "knex";
import config from "../../knexfile";

const dbConnection = knex(config.development);

export default dbConnection;
