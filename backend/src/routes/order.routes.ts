import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, requireAuth, type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { calculateShipping, formatAddress } from "../utils/shipping.js";

const router = Router();
type ProductRecord = { id: string; name: string; price: unknown; stock: number };

const orderSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.coerce.number().int().min(1) })).min(1),
  customerName: z.string().min(2),
  customerEmail: z.email(),
  phone: z.string().min(8),
  address: z.string().min(3),
  addressNumber: z.string().min(1),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  postalCode: z.string().min(5),
  deliveryDate: z.string().optional(),
  paymentMethod: z.enum(["PIX", "CARD", "BOLETO"]),
  addressId: z.string().optional(),
});

const orderInclude = { items: true, user: { select: { id: true, name: true, email: true } } } as const;

router.post("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = orderSchema.parse(req.body);
    const savedAddress = data.addressId ? await prisma.address.findFirst({ where: { id: data.addressId, userId: req.user!.id } }) : null;
    if (data.addressId && !savedAddress) return res.status(404).json({ message: "Endereço não encontrado." });
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } }) as ProductRecord[];

    if (products.length !== new Set(productIds).size) {
      return res.status(404).json({ message: "Um ou mais produtos não foram encontrados." });
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    const lineItems = data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) throw new Error(`Estoque insuficiente para ${product.name}.`);
      return { product, quantity: item.quantity };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const shipping = await calculateShipping(formatAddress({
      street: savedAddress?.street ?? data.address,
      number: savedAddress?.number ?? data.addressNumber,
      complement: savedAddress?.complement,
      neighborhood: savedAddress?.neighborhood ?? data.neighborhood,
      city: savedAddress?.city ?? data.city,
      state: savedAddress?.state ?? "RJ",
      postalCode: savedAddress?.postalCode ?? data.postalCode,
    }));
    const deliveryFee = shipping.fee;
    const order = await prisma.$transaction(async (transaction: any) => {
      for (const item of lineItems) {
        await transaction.product.update({ where: { id: item.product.id }, data: { stock: { decrement: item.quantity } } });
      }
      return transaction.order.create({
        data: {
          userId: req.user!.id,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          phone: data.phone,
          address: data.address,
          addressNumber: data.addressNumber,
          neighborhood: data.neighborhood,
          city: data.city,
          postalCode: data.postalCode,
          paymentMethod: data.paymentMethod,
          deliveryDate: data.deliveryDate ? new Date(`${data.deliveryDate}T12:00:00`) : null,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          items: { create: lineItems.map(({ product, quantity }) => ({ productId: product.id, name: product.name, price: product.price, quantity })) },
        },
        include: orderInclude,
      });
    });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/mine", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" }, include: orderInclude });
    return res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: orderInclude });
    if (!order || (req.user!.role !== "ADMIN" && order.userId !== req.user!.id)) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }
    return res.json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: orderInclude });
    return res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const status = z.object({ status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]) }).parse(req.body);
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: status.status }, include: orderInclude });
    return res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
