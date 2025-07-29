'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (data?.session) {
        router.push('/dashboard')
      } else {
        router.push('/auth')
      }
    }

    handleSession()
  }, [])

  return <p className="text-center mt-20 bg-gradient-to-br from-indigo-800 via-purple-800 to-gray-900">Logging you in, please wait...</p>
}
