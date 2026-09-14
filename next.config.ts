import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfjs-dist's ESM build breaks when webpack bundles it for the server
  // ("Object.defineProperty called on non-object"); load it via require() instead.
  serverExternalPackages: ["pdfjs-dist", "pdf-parse"],
};

export default nextConfig;
