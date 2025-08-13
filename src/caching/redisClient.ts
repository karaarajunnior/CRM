import redis from "ioredis";

const redisClient = redis.createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect();

export default redisClient;

// import { createClient, type RedisClientType } from "redis";

// let client: RedisClientType | null | any = null;

// export async function redisClient() {
// 	if (!client) {
// 		client = createClient();
// 		client.on("error", (err) => console.error("Redis Client Error", err));
// 		client.on("connect", () => console.log("connected"));
// 		await client.connect();
// 	}

// 	return client;
// }
