import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
	try {
		const products = await prisma.product.findMany({
			distinct: ["category"],
			select: { category: true },
			orderBy: { category: "asc" },
		}) as Array<{ category: string }>;

		return res.json(products.map((product) => product.category));
	} catch (error) {
		return next(error);
	}
});

export default router;
