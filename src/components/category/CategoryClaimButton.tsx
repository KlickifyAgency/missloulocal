'use client'
import { useState } from 'react'
import { Shield, CheckCircle } from 'lucide-react'
import ClaimModal from '@/components/claim/ClaimModal'

export default function CategoryClaimButton({ bizId, bizName, isClaimed }: { bizId: string; bizName: string; isClaimed: boolean }) {
  const [open, setOpen] = useState(false)
  if (isClaimed) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '36px' }}>
      <CheckCircle size={14} color='#16a34a' />
      <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>Verified Owner</span>
    </div>
  )
  return (
    <>
      <button onClick={() => setOpen(true)} type='button' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fbbf24', border: 'none', borderRadius: '12px', height: '44px', minHeight: 0, color: '#78350f', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px rgba(251,191,36,0.4)' }}>
        <Shield size={15} strokeWidth={2.5} />Is this your business? Claim it free
      </button>
      {open && <ClaimModal businessId={bizId} businessName={bizName} onClose={() => setOpen(false)} />}
    </>
  )
}
