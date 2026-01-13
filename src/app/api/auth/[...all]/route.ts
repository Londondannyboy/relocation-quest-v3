import { authApiHandler } from '@neondatabase/neon-js/auth/next/server';

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL || process.env.NEON_AUTH_BASE_URL;

if (!authUrl) {
  console.warn('Neon Auth URL is not set - auth endpoints will not work');
}

// Create handlers that proxy to Neon Auth
const handlers = authUrl
  ? authApiHandler(authUrl)
  : {
      GET: () => new Response('Auth not configured. Set NEXT_PUBLIC_NEON_AUTH_URL environment variable.', { status: 503 }),
      POST: () => new Response('Auth not configured. Set NEXT_PUBLIC_NEON_AUTH_URL environment variable.', { status: 503 }),
    };

export const GET = handlers.GET;
export const POST = handlers.POST;
