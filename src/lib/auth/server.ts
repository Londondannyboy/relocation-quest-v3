'use server';

// Use @neondatabase/auth (not neon-js wrapper) - matches fractional.quest pattern
import { createAuthServer } from '@neondatabase/auth/next/server';

export const authServer = createAuthServer();
