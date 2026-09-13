import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { calculateShipping, formatAddress } from "../utils/shipping.js";

const router = Router();
const addressSchema = z.object({
  label: z.string().min(2),
  recipientName: z.string().min(2),
  street: z.string().min(3),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
  postalCode: z.string().min(5),
});

router.use(requireAuth);

router.get("/", async (req: AuthenticatedRequest, res, next) => {
  try { return res.json(await prisma.address.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } })); }
  catch (error) { next(error); }
});

router.post("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = addressSchema.parse(req.body);
    const address = await prisma.address.create({ data: { ...data, userId: req.user!.id } });
    const shipping = await calculateShipping(formatAddress(address));
    return res.status(201).json({ address, shipping });
  } catch (error) { next(error); }
});

router.delete("/:id", async (req: AuthenticatedRequest, res, next) => {
  try { await prisma.address.deleteMany({ where: { id: req.params.id, userId: req.user!.id } }); return res.status(204).send(); }
  catch (error) { next(error); }
});

router.post("/quote", async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = addressSchema.omit({ label: true, recipientName: true }).parse(req.body);
    return res.json(await calculateShipping(formatAddress(data)));
  } catch (error) { next(error); }
});

export default router;