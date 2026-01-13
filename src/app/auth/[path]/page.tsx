'use client';

import { AuthView } from '@/lib/auth/client';
import { use } from 'react';

export default function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = use(params);
  const hasNeonAuth = !!process.env.NEXT_PUBLIC_NEON_AUTH_URL;

  if (!hasNeonAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Auth Not Configured</h1>
          <p className="text-stone-400">Set NEXT_PUBLIC_NEON_AUTH_URL to enable authentication.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-full max-w-md p-6 bg-stone-900 rounded-2xl border border-stone-800">
        <AuthView 
          path={path} 
          social={{ providers: ['google'] }}
        />
      </div>
    </main>
  );
}