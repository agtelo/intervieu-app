import type { NextConfig } from "next";
import { resolve } from "path";

const dbPath = resolve(process.cwd(), "prisma/dev.db");
const dbUrl = `file:${dbPath}`;

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: dbUrl,
  },
};

export default nextConfig;
