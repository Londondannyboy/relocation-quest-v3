'use client';

import { createAuthClient } from '@neondatabase/neon-js/auth/next';

export const authClient = createAuthClient();

export {
  NeonAuthUIProvider,
  AuthView,
  UserButton,
  SignedIn,
  SignedOut,
  useAuthData,
  useAuthenticate,
} from '@neondatabase/neon-js/auth/react';
