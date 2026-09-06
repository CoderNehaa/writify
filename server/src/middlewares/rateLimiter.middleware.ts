import { Request, Response, NextFunction, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../clients/redis.client";
import { AUTH_RATE_LIMIT } from "../constants/auth";
import { NODE_ENV } from "../config/environment";

// `RedisStore`'s constructor immediately sends a command to load its Lua
// script — if built eagerly (at import time), that happens before
// `connectRedis()` (called from App's constructor) has resolved, and
// node-redis throws "The client is closed". Building it lazily, on the
// first real request, guarantees the connection has had time to establish.
let limiter: RequestHandler | null = null;

const getLimiter = (): RequestHandler => {
  if (!limiter) {
    limiter = rateLimit({
      windowMs: AUTH_RATE_LIMIT.WINDOW_MS,
      limit: AUTH_RATE_LIMIT.MAX_ATTEMPTS,
      standardHeaders: true,
      legacyHeaders: false,
      // The test suite mocks the Redis client with a plain key-value store,
      // not a real EVAL-capable Redis — skip rate limiting there.
      skip: () => NODE_ENV === "test",
      message: {
        success: false,
        message: "Too many attempts, please try again later.",
      },
      store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      }),
    });
  }
  return limiter;
};

// client can hit routes with authRateLimiter at most 10 times per 15-minute window
export const authRateLimiter = (req: Request, res: Response, next: NextFunction) =>
  getLimiter()(req, res, next);
