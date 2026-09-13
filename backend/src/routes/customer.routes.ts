import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: { id: true, name: true, email: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.json(customers);
  } catch (error) {
    return next(error);
  }
});

export default router;