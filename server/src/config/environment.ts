import dotenv from "dotenv";
dotenv.config();

export const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL || "";
export const PORT = Number(process.env.PORT) || 8088;
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

// AWS
export const AWS_REGION = process.env.AWS_REGION || "";
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
