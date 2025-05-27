'use client'

import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <SessionProvider>{children}</SessionProvider>
} 