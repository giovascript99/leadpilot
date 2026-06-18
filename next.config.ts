import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 è un modulo nativo: va escluso dal bundling server
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
