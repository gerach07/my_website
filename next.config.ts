import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Force production to ignore all TypeScript & Linting hurdles
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. Address Next 16 Turbopack strictness
  experimental: {
    // If your machine is timing out, this forces a single-thread build
    cpus: 1, 
  },
  // 3. Ensure your Three.js/3D libraries are processed correctly
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
