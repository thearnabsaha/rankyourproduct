import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function prepareDatabaseUrl() {
  if (process.env.VERCEL) {
    const dest = "/tmp/rankyourproduct.db";
    const seed = path.join(process.cwd(), "prisma", "seed.db");
    try {
      if (!fs.existsSync(dest) && fs.existsSync(seed)) {
        fs.copyFileSync(seed, dest);
      }
    } catch {
      // filesystem may be read-only besides /tmp; ignore and let Prisma error
    }
    process.env.DATABASE_URL = `file:${dest}`;
  } else if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
  }
}

prepareDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
