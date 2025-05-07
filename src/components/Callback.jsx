'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Callback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const [codeVerifier, setCodeVerifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCodeVerifier = localStorage.getItem('codeVerifier')
      setCodeVerifier(storedCodeVerifier)
    }
  }, [])

  useEffect(() => {
    const exchange = async () => {
      if (!code || !codeVerifier) return

      const { error } = await supabase.auth.exchangeCodeForSession(code, {
        code_verifier: codeVerifier,
      })

      if (error) {
        console.error('❌ Error exchanging code:', error.message)
        setLoading(false)
        return
      }

      const { data: userData, error: userError } = await supabase.auth.getSession()
      if (userError || !userData?.user) {
        console.error('❌ Failed to fetch user from Supabase session')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    }

    if (codeVerifier) {
      exchange()
    }
  }, [code, codeVerifier, router])

  return <p>{loading ? 'Signing you in...' : 'Something went wrong.'}</p>
}
