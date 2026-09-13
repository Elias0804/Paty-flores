import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.js";

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
  };
};

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token de acesso ausente ou inválido." });
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Sessão inválida." });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Você precisa estar autenticado." });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Acesso restrito para administradores." });
  }

  next();
}
