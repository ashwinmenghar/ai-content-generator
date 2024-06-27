import Redis from "ioredis";

export const client = new Redis(process.env.REDIS_URL as string);
