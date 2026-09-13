import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "8mb" }));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "paty-flores-backend",
    message: "API da loja Paty Flores. Use /health ou /api/*",
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "paty-flores-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/customers", customerRoutes);

app.use(errorMiddleware);

export default app;
