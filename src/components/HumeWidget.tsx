'use client'

import { useState, useEffect, useCallback } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
// import { useAuthData } from '@neondatabase/neon-js/auth/react'

const CONFIG_ID = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || ''

export interface HumeMessage {
  type: 'user_message' | 'assistant_message'
  message?: {
    content?: string
    role?: string
  }
}

// Inner component that uses the voice hook
function VoiceWidget({
  accessToken,
  userName,
  userId,
  isAuthenticated,
}: {
  accessToken: string
  userName?: string
  userId?: string
  isAuthenticated: boolean
}) {
  const { connect, disconnect, status, messages } = useVoice()
  const [isPending, setIsPending] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const log = (msg: string) => {
    const time = new Date().toLocaleTimeString()
    console.log(`[Hume ${time}]`, msg)
    setLogs(prev => [...prev.slice(-9), `${time} ${msg}`])
  }

  const handleConnect = useCallback(async () => {
    setIsPending(true)

    // Variables for the CLM (Quest prompt)
    const sessionSettings = {
      type: 'session_settings' as const,
      variables: {
        user_id: userId || '',
        first_name: userName || '',
        is_authenticated: isAuthenticated ? 'true' : 'false',
      },
      // Pass custom_session_id to link with Zep/CLM memory
      customSessionId: userId ? `${userName || 'User'}|${userId}` : undefined
    }

    log(`Connecting: ${userName || 'Guest'}, auth=${isAuthenticated}`)

    try {
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: CONFIG_ID,
        sessionSettings: sessionSettings as any // Type cast if needed depending on SDK version
      })
      log('Connected!')
    } catch (e: any) {
      log(`Error: ${e?.message || e}`)
      console.error('[Hume] Connect error:', e)
    }

    setIsPending(false)
  }, [connect, accessToken, userName, userId, isAuthenticated])

  const handleDisconnect = useCallback(() => {
    disconnect()
    log('Disconnected')
  }, [disconnect])

  const isConnected = status.value === 'connected'

  const lastMsg = [...messages].reverse().find((m: any) =>
    m.type === 'assistant_message' && m.message?.content
  ) as any

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-stone-900 border-stone-800">
      {/* Mic Button */}
      <button
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={isPending}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isConnected
            ? 'bg-green-500 hover:bg-green-600 animate-pulse'
            : isPending
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 border-2 border-purple-400'
        }`}
      >
        {isPending ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Status Text */}
      <p className="text-sm text-stone-300 font-medium">
        {isPending ? 'Connecting...' : isConnected ? 'Listening...' : 'Tap to talk'}
      </p>

      {/* Stop Button */}
      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Stop Conversation
        </button>
      )}

      {/* Last Message */}
      {lastMsg?.message?.content && (
        <div className="max-w-md bg-stone-800 rounded-lg px-4 py-3 text-sm text-stone-200 shadow-inner">
          {lastMsg.message.content.slice(0, 200)}
          {lastMsg.message.content.length > 200 && '...'}
        </div>
      )}

      {/* Debug Logs (Collapsible) */}
      <details className="w-full max-w-xs text-xs text-stone-500">
        <summary className="cursor-pointer hover:text-stone-400 mb-2 text-center">Debug Info</summary>
        <div className="bg-black/40 p-2 rounded font-mono max-h-32 overflow-auto">
           <div className="text-yellow-500 mb-1">User: {userName || 'Guest'} ({isAuthenticated ? 'Auth' : 'Anon'})</div>
           {logs.map((l, i) => <div key={i} className="truncate">{l}</div>)}
        </div>
      </details>
    </div>
  )
}

export function HumeWidget() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Neon Auth Integration (MOCKED for now - TODO: integrate Neon Auth)
  // const { auth, status } = useAuthData()
  const isAuthenticated = false // mock - will be true when Neon Auth is integrated
  const userId: string | undefined = undefined // auth?.user?.id
  const userName: string | undefined = undefined // auth?.user?.name

  useEffect(() => {
    fetch('/api/hume-token')
      .then(res => res.json())
      .then(data => {
        if (data.accessToken) {
          setAccessToken(data.accessToken)
        } else {
          setError(data.error || 'No token received')
        }
      })
      .catch(err => {
        setError(err.message)
      })
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 text-center p-4 border border-red-900/50 bg-red-900/10 rounded-lg">
        <div className="text-red-400 font-medium">Voice Unavailable</div>
        <div className="text-xs text-red-300">{error}</div>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-400">Loading voice...</p>
      </div>
    )
  }

  return (
    <VoiceProvider>
      <VoiceWidget accessToken={accessToken} userName={userName} userId={userId} isAuthenticated={isAuthenticated} />
    </VoiceProvider>
  )
}

