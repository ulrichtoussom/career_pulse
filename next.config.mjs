/** @type {import('next').NextConfig} */
const nextConfig = {
  // Génère un serveur Node.js autonome dans .next/standalone
  // Indispensable pour Docker : évite de copier node_modules dans le runner
  output: 'standalone',

  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'chaweb.onrender.com'],
    },
  },
}

export default nextConfig
