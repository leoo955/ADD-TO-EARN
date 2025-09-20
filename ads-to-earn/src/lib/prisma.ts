import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // facultatif : log
  log: ["query", "info", "warn", "error"]
});

export default prisma;
