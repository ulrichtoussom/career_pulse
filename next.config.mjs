/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // Cela aide Next.js à comprendre qu'il est derrière un proxy (Render)
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'chaweb.onrender.com'],
    },
  },
}
