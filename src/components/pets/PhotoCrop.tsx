'use client'
import { useState, useRef } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check } from 'lucide-react'

interface Props {
  imageSrc: string
  onComplete: (croppedBlob: Blob) => void
  onCancel: () => void
}

export default function PhotoCrop({ imageSrc, onComplete, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>({ unit: '%', x: 5, y: 5, width: 90, height: 90 })
  const [processing, setProcessing] = useState(false)

  function dataURItoBlob(dataURI: string) {
    const byteStr = atob(dataURI.split(',')[1])
    const ab = new ArrayBuffer(byteStr.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i)
    return new Blob([ab], { type: 'image/jpeg' })
  }

  async function cropAndUpload() {
    const img = imgRef.current
    if (!img) return
    setProcessing(true)
    const scaleX = img.naturalWidth / img.offsetWidth
    const scaleY = img.naturalHeight / img.offsetHeight
    const canvas = document.createElement('canvas')
    const cropW = (crop.width / 100) * img.offsetWidth
    const cropH = (crop.height / 100) * img.offsetHeight
    const cropX = (crop.x / 100) * img.offsetWidth
    const cropY = (crop.y / 100) * img.offsetHeight
    canvas.width = cropW * scaleX
    canvas.height = cropH * scaleY
    const ctx = canvas.getContext('2d')
    if (!ctx) { setProcessing(false); return }
    ctx.drawImage(img, cropX * scaleX, cropY * scaleY, cropW * scaleX, cropH * scaleY, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (blob) onComplete(blob)
      else onComplete(dataURItoBlob(canvas.toDataURL('image/jpeg', 0.9)))
      setProcessing(false)
    }, 'image/jpeg', 0.9)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <p style={{ color: 'white', fontSize: '16px', fontWeight: 700, margin: 0 }}>Adjust your photo</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>Drag to reposition</p>
        </div>
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#000' }}>
          <ReactCrop crop={crop} onChange={c => setCrop(c)}>
            <img ref={imgRef} src={imageSrc} alt='crop preview' style={{ maxWidth: '100%', maxHeight: '55vh', display: 'block', margin: '0 auto' }} />
          </ReactCrop>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type='button' onClick={onCancel} style={{ flex: 1, height: '52px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <X size={16} /> Cancel
          </button>
          <button type='button' onClick={cropAndUpload} disabled={processing} style={{ flex: 2, height: '52px', minHeight: 0, backgroundColor: processing ? '#94a3b8' : '#f97316', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Check size={16} /> {processing ? 'Processing...' : 'Use this photo'}
          </button>
        </div>
      </div>
    </div>
  )
}
