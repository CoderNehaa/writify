import { NextFunction, Request, Response } from "express";

function GlobalErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = 500;
  const message = error.message || "Something went wrong";

  res.status(status).send({
    success: false,
    message,
  });
}

export default GlobalErrorHandler;
