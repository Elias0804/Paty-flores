import bcrypt from "bcryptjs";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

async function ensureDefaultAdmin() {
  const adminEmail = "admin@patyflores.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Default admin created: admin@patyflores.com / admin123");
  } else if (existingAdmin.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { role: "ADMIN" },
    });

    console.log("Default admin permissions restored: admin@patyflores.com");
  }
}

const port = Number(process.env.PORT ?? 4000);

app.listen(port, async () => {
  await ensureDefaultAdmin();
  console.log(`Paty Flores API running on http://localhost:${port}`);
});
