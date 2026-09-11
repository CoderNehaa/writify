import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import {
  ACCESS_TOKEN_SECRET_KEY,
  NODE_ENV,
  REFRESH_TOKEN_SECRET_KEY,
} from "../config/environment";
import {
  ACCESS_TOKEN_EXPIRY_SECONDS,
  ACCESS_TOKEN_EXPIRY_TIME,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_EXPIRY_SECONDS,
  REFRESH_TOKEN_EXPIRY_TIME,
  REFRESH_TOKEN_NAME,
} from "../constants/auth";
import { redisClient } from "./redis.client";
import logger from "../utils/logger";

const refreshTokenRedisKey = (userId: string) => `refresh_token:${userId}`;

const isProd = NODE_ENV === "production";

// In production the SPA (e.g. CloudFront) and the API are different sites,
// so the auth cookies must be `SameSite=None; Secure` or the browser won't
// send them on cross-site XHR. Locally, `lax` over http keeps dev simple.
const cookieOptions = (maxAgeMs?: number): CookieOptions => ({
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  path: "/",
  ...(maxAgeMs ? { maxAge: maxAgeMs } : {}),
});

export class TokenService {
  generateAndSaveAuthTokens = async (res: Response, userId: string) => {
    const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRY_TIME,
    });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRY_TIME,
    });

    // Persisted cookies (not session cookies) so a browser restart keeps
    // the user signed in for the refresh token's lifetime.
    res.cookie(
      ACCESS_TOKEN_NAME,
      accessToken,
      cookieOptions(ACCESS_TOKEN_EXPIRY_SECONDS * 1000)
    );
    res.cookie(
      REFRESH_TOKEN_NAME,
      refreshToken,
      cookieOptions(REFRESH_TOKEN_EXPIRY_SECONDS * 1000)
    );

    // Store the currently-valid refresh token so it can be revoked
    // server-side on logout / password-change. A Redis failure here must
    // not block the login itself — the session is still issued; it just
    // won't survive the first token refresh until Redis is healthy again.
    try {
      await redisClient.set(refreshTokenRedisKey(userId), refreshToken, {
        EX: REFRESH_TOKEN_EXPIRY_SECONDS,
      });
    } catch (err) {
      logger.error(
        "Failed to persist refresh token to Redis (session still issued):",
        err
      );
    }

    return { accessToken, refreshToken };
  };

  validateToken = async (
    accessToken: string | undefined,
    refreshToken: string | undefined,
    res: Response
  ) => {
    try {
      if (accessToken) {
        return {
          decoded: jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY) as {
            id: string;
          },
          accessToken,
          refreshToken,
        };
      }
    } catch (err: any) {
      logger.error("Access token validation failed:", err?.message ?? err);
    }

    try {
      if (refreshToken) {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY) as {
          id: string;
        };

        if (decoded.id) {
          let stored: string | null;
          try {
            stored = await redisClient.get(refreshTokenRedisKey(decoded.id));
          } catch (redisErr) {
            // Redis unreachable — fail open so an outage doesn't sign
            // everyone out. Revocation resumes once Redis is back.
            logger.error(
              "Redis unavailable during refresh-token check, allowing refresh:",
              redisErr
            );
            stored = refreshToken;
          }

          // A definitive value that isn't this token (or an absent key from
          // a logout / password-change) means the session was revoked.
          if (stored !== refreshToken) {
            return null;
          }

          const tokens = await this.generateAndSaveAuthTokens(res, decoded.id);
          return {
            decoded,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
        }
      }
    } catch (err: any) {
      logger.error("Refresh token validation failed:", err?.message ?? err);
    }

    return null;
  };

  revokeRefreshToken = async (userId: string) => {
    try {
      await redisClient.del(refreshTokenRedisKey(userId));
    } catch (err) {
      logger.error("Failed to revoke refresh token in Redis:", err);
    }
  };

  clearCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_NAME, cookieOptions());
    res.clearCookie(REFRESH_TOKEN_NAME, cookieOptions());
  }
}
