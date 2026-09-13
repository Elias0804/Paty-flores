import type { NextFunction, Request, Response } from "express";

export default function errorMiddleware(
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({
    message: error.message || "Erro interno do servidor",
  });
}
