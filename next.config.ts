import type { NextConfig } from "next";
import { resolve } from "path";

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  const dbPath = resolve(process.cwd(), "prisma/dev.db");
  dbUrl = `file:${dbPath}`;
}

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: dbUrl,
  },
};

export default nextConfig;
