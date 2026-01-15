'use client';

import { CopilotKit } from '@copilotkit/react-core';

// Use built-in Next.js runtime for chat (AG-UI compatibility issues with pydantic-ai)
// Railway agent is used for Hume voice via CLM endpoint at /chat/completions
const RUNTIME_URL = '/api/copilotkit';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl={RUNTIME_URL}>
      {children}
    </CopilotKit>
  );
}
