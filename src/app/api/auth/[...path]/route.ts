// Use @neondatabase/auth (not neon-js wrapper) - matches fractional.quest pattern
import { authApiHandler } from '@neondatabase/auth/next/server';

export const { GET, POST } = authApiHandler();
