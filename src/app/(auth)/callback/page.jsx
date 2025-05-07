// app/callback/page.tsx (if using App Router)
import { Suspense } from 'react'
import Callback from '@/components/Callback'

export default function CallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Callback />
    </Suspense>
  )
}
