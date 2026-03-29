'use client'
import { useState, useRef, useCallback } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check } from 'lucide-react'

interface Props {
  imageSrc: string
  onComplete: (croppedBlob: Blob) => void
  onCancel: () => void
}

function centerAspectCrop(w: number, h: number) {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 4/3, w, h), w, h)
}

export default function PhotoCrop({ imageSrc, onComplete, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [processing, setProcessing] = useState(false)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
  }

  async function cropAndUpload() {
    if (!imgRef.current || !crop) return
    setProcessing(true)
    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    const pixelCrop = {
      x: (crop.x / 100) * imgRef.current.width * scaleX,
      y: (crop.y / 100) * imgRef.current.height * scaleY,
      width: (crop.width / 100) * imgRef.current.width * scaleX,
      height: (crop.height / 100) * imgRef.current.height * scaleY,
    }
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(imgRef.current, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
    canvas.toBlob(blob => {
      if (blob) onComplete(blob)
      setProcessing(false)
    }, 'image/jpeg', 0.9)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ color: 'white', fontSize: '16px', fontWeight: 700, margin: 0 }}>Adjust your photo</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Drag to reposition</p>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
          <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={4/3}>
            <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} style={{ maxWidth: '100%', maxHeight: '60vh', display: 'block' }} alt='crop' />
          </ReactCrop>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type='button' onClick={onCancel} style={{ flex: 1, height: '52px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <X size={18} /> Cancel
          </button>
          <button type='button' onClick={cropAndUpload} disabled={processing} style={{ flex: 2, height: '52px', minHeight: 0, backgroundColor: '#f97316', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Check size={18} /> {processing ? 'Processing...' : 'Use this photo'}
          </button>
        </div>
      </div>
    </div>
  )
}