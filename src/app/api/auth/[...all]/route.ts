import { NextResponse } from 'next/server';

// Conditionally import and create handler only if NEXT_PUBLIC_NEON_AUTH_URL is set
const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;

if (!authUrl) {
  console.warn('NEXT_PUBLIC_NEON_AUTH_URL is not set - auth endpoints will not work');
}

let handler: { GET: any; POST: any } | null = null;

if (authUrl) {
  // Dynamic import to avoid build errors when env var not set
  const { authApiHandler } = require('@neondatabase/neon-js/auth/next/server');
  handler = authApiHandler(authUrl);
}

export async function GET(request: Request, context: any) {
  if (!handler) {
    return NextResponse.json(
      { error: 'Neon Auth not configured. Set NEXT_PUBLIC_NEON_AUTH_URL environment variable.' },
      { status: 503 }
    );
  }
  return handler.GET(request, context);
}

export async function POST(request: Request, context: any) {
  if (!handler) {
    return NextResponse.json(
      { error: 'Neon Auth not configured. Set NEXT_PUBLIC_NEON_AUTH_URL environment variable.' },
      { status: 503 }
    );
  }
  return handler.POST(request, context);
}
