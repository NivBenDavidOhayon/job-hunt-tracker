// server/prisma.config.ts

// טוען את .env כשה־CLI של Prisma רץ (Prisma 7 לא עושה את זה לבד)
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  // לא חובה אבל אפשרי:
  // migrations: {
  //   path: "prisma/migrations",
  // },

  datasource: {
    // כאן Prisma יקבל URL *לא ריק* כי dotenv כבר טען את .env
    url: env("DATABASE_URL"),
  },
});
