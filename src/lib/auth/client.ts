'use client';

// Use the same auth client pattern as fractional.quest
import { createAuthClient } from '@neondatabase/auth/next';

export const authClient = createAuthClient();

// Re-export UI components from @neondatabase/auth (not neon-js wrapper)
// This matches fractional.quest pattern exactly
export { NeonAuthUIProvider, AuthView, UserButton, SignedIn, SignedOut } from '@neondatabase/auth/react/ui';

// Also export legacy hooks for backward compatibility
export {
  useAuthData,
  useAuthenticate,
} from '@neondatabase/neon-js/auth/react';
