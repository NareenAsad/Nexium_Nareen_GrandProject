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

      if (error || !data.session) {
        router.push('/auth')
      } else {
        router.push('/dashboard')
      }
    }

    handleSession()
  }, [router, supabase])

  return <p className="text-center mt-20">Logging you in, please wait...</p>
}
