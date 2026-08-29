import jwt from "jsonwebtoken";
import { Response } from "express";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../config/environment";
import {
  ACCESS_TOKEN_EXPIRY_TIME,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_EXPIRY_TIME,
  REFRESH_TOKEN_NAME,
} from "../constants/auth";

export class TokenService {
  generateAndSaveAuthTokens = async (res: Response, userId: string) => {
    // Create access and refresh token
    const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRY_TIME,
    });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRY_TIME,
    });
    // Save access and refresh token in cookies
    res.cookie(ACCESS_TOKEN_NAME, accessToken);
    res.cookie(REFRESH_TOKEN_NAME, refreshToken);
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
      console.error("Access token validation failed:", err.message);
    }

    try {
      if (refreshToken) {
        let decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY) as {
          id: string;
        };

        if (decoded.id) {
          const tokens = await this.generateAndSaveAuthTokens(res, decoded.id);
          refreshToken = tokens.refreshToken;
          accessToken = tokens.accessToken;
          return { decoded, accessToken, refreshToken };
        }
      }
    } catch (err: any) {
      console.error("Refresh token validation failed:", err.message);
    }

    return null;
  };

  clearCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.clearCookie(REFRESH_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }
}
