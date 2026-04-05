import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status,
    message,
    stack: err.stack,
  });

  res.status(status).json({
    success: false,
    message,
    code: err.code || "INTERNAL_ERROR",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}