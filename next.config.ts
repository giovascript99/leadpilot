import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @libsql/client ha binding nativi opzionali: va escluso dal bundling server
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
