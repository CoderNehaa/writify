import { Request, Response, NextFunction, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../clients/redis.client";
import { AUTH_RATE_LIMIT, USERNAME_CHECK_RATE_LIMIT } from "../constants/auth";
import { NODE_ENV } from "../config/environment";

// `RedisStore`'s constructor immediately sends a command to load its Lua
// script — if built eagerly (at import time), that happens before
// `connectRedis()` has resolved and node-redis throws "The client is
// closed". Building each limiter lazily, on its first real request,
// guarantees the connection has had time to establish.
const buildLimiter = (
  windowMs: number,
  limit: number,
  keyPrefix: string
): RequestHandler =>
  rateLimit({
    windowMs,
    limit,
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
      // Distinct prefix per limiter so their counters never share a key.
      prefix: keyPrefix,
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
  });

let authLimiter: RequestHandler | null = null;
let usernameCheckLimiter: RequestHandler | null = null;

// At most 10 hits per 15-minute window (login / signup / verify / google / forgot).
export const authRateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!authLimiter) {
    authLimiter = buildLimiter(
      AUTH_RATE_LIMIT.WINDOW_MS,
      AUTH_RATE_LIMIT.MAX_ATTEMPTS,
      "rl:auth:"
    );
  }
  return authLimiter(req, res, next);
};

// Generous budget for the debounced username-availability check.
export const usernameCheckRateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!usernameCheckLimiter) {
    usernameCheckLimiter = buildLimiter(
      USERNAME_CHECK_RATE_LIMIT.WINDOW_MS,
      USERNAME_CHECK_RATE_LIMIT.MAX_ATTEMPTS,
      "rl:username-check:"
    );
  }
  return usernameCheckLimiter(req, res, next);
};
