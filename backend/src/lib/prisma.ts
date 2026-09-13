import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";

const globalForPrisma = globalThis as unknown as {
  prisma?: any;
};

function getConnectionString() {
  const configuredUrl = process.env.DATABASE_URL;

  if (!configuredUrl?.startsWith("prisma+postgres://")) {
    return configuredUrl ?? "postgresql://paty:paty_dev@localhost:5432/paty_flores?schema=public";
  }

  const apiKey = configuredUrl.match(/[?&]api_key=([^&]+)/)?.[1];
  if (!apiKey) return configuredUrl;

  try {
    const connectionInfo = JSON.parse(Buffer.from(apiKey, "base64url").toString("utf8")) as {
      databaseUrl?: string;
    };

    return connectionInfo.databaseUrl ?? configuredUrl;
  } catch {
    return configuredUrl;
  }
}

const connectionString = getConnectionString();
const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter }) as any;

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
