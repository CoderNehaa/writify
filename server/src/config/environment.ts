import dotenv from "dotenv";
dotenv.config();

export const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL || "";
export const PORT = Number(process.env.PORT) || 8088;
// Public-facing base URL, used e.g. by Swagger's "Try it out" — override in
// production/staging to the real domain (https://api.yourdomain.com/api).
export const PUBLIC_API_URL =
  process.env.PUBLIC_API_URL || `http://localhost:${PORT}/api`;
export const ACCESS_TOKEN_SECRET_KEY =
  process.env.ACCESS_TOKEN_SECRET_KEY || "";
export const REFRESH_TOKEN_SECRET_KEY =
  process.env.REFRESH_TOKEN_SECRET_KEY || "";

export const EMAIL_SENDER_MAIL = process.env.EMAIL_SENDER_MAIL || "";
export const EMAIL_SENDER_NAME = process.env.EMAIL_SENDER_NAME || "";
export const EMAIL_SENDER_PASSWORD = process.env.EMAIL_SENDER_PASSWORD;

// CORS Origin
const CORS_ORIGIN_ENV = process.env.CORS_ORIGIN;
export const CORS_ORIGIN = CORS_ORIGIN_ENV?.split(",")
  .map((v) => v)
  .filter((v) => v);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// AWS
export const AWS_REGION = process.env.AWS_REGION || "";
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

// Google OAuth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

// Redis
export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
