import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth, type AuthenticatedRequest } from "../middlewares/auth.middleware.js";

const router = Router();

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().refine((value) => value === "" || z.url().safeParse(value).success || /^data:image\/(png|jpeg|webp);base64,/.test(value), "Imagem inválida.").optional(),
});

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  return res.json(product);
});

router.post("/", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = productSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        imageUrl: data.imageUrl || null,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = productSchema.parse(req.body);

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        imageUrl: data.imageUrl || null,
      },
    });

    return res.json(product);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
