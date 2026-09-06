import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../config/environment";
import logger from "../utils/logger";

function GlobalErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = 500;

  logger.error(`Unhandled error on ${req.method} ${req.url}: ${error.stack || error.message}`);

  const message =
    NODE_ENV === "production"
      ? "Something went wrong"
      : error.message || "Something went wrong";

  res.status(status).send({
    success: false,
    message,
  });
}

export default GlobalErrorHandler;
