export const dynamic = 'force-dynamic';
export const dynamicParams = true;

function AuthNotConfigured() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Auth Not Configured</h1>
        <p className="text-stone-400">Set NEXT_PUBLIC_NEON_AUTH_URL to enable authentication.</p>
      </div>
    </main>
  );
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const hasNeonAuth = !!process.env.NEXT_PUBLIC_NEON_AUTH_URL;

  if (!hasNeonAuth) {
    return <AuthNotConfigured />;
  }

  const { path } = await params;

  // Dynamic import to avoid build errors when NEXT_PUBLIC_NEON_AUTH_URL not set
  const { AccountView } = require('@neondatabase/neon-js/auth/react');

  return (
    <main className="min-h-screen bg-stone-950 p-4 md:p-6">
      <AccountView path={path} />
    </main>
  );
}
