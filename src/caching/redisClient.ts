import redis from "ioredis";

const redisClient = redis.createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect();

export default redisClient;
