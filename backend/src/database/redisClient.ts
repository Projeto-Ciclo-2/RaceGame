import Redis from "ioredis";
import { config } from "../config";

const redisClient = new Redis({
	port: config.REDIS_PORT,
	host: config.REDIS_HOST,
});

export default redisClient;
