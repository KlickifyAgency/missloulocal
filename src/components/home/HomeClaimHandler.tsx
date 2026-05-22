'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ClaimModal from '@/components/claim/ClaimModal'

function ClaimHandler() {
  const searchParams = useSearchParams()
  const claimSlug = searchParams.get('claim')
  const [claimBiz, setClaimBiz] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    if (!claimSlug) return
    fetch('/api/businesses/by-slug?slug=' + claimSlug)
      .then(r => r.json())
      .then(d => { if (d.id) setClaimBiz({ id: d.id, name: d.name }) })
      .catch(() => {})
  }, [claimSlug])

  if (!claimBiz) return null
  return <ClaimModal businessId={claimBiz.id} businessName={claimBiz.name} onClose={() => setClaimBiz(null)} />
}

export default function HomeClaimHandler() {
  return (
    <Suspense fallback={null}>
      <ClaimHandler />
    </Suspense>
  )
}
