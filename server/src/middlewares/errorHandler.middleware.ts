import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../config/environment";
import logger from "../utils/logger";

function GlobalErrorHandler(
  error: Error & { status?: number; statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // express.json()/urlencoded() reject a malformed body with a SyntaxError
  // that carries status 400 — respect that instead of always answering 500.
  const status = error.status || error.statusCode || 500;

  logger.error(`Unhandled error on ${req.method} ${req.url}: ${error.stack || error.message}`);

  const message =
    status < 500
      ? error.message || "Bad Request"
      : NODE_ENV === "production"
        ? "Something went wrong"
        : error.message || "Something went wrong";

  res.status(status).send({
    success: false,
    message,
  });
}

export default GlobalErrorHandler;
