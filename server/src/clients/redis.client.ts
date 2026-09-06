import { createClient } from "redis";
import { REDIS_URL } from "../config/environment";
import logger from "../utils/logger";

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => logger.error("Redis client error:", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("Redis connected successfully!");
  }
};
