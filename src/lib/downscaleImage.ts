// Downscale + WebP encode in the browser before uploading.
// Uploads used to store camera originals (2-4 MB each) straight to Supabase
// Storage, which blew the free-plan egress quota. Returns the original file
// untouched if the browser can't decode or encode it.
export async function downscaleImage(file: File | Blob, maxDim = 900, quality = 0.82): Promise<File | Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', quality))
    if (!blob) return file
    return new File([blob], 'photo.webp', { type: 'image/webp' })
  } catch(e) {
    return file
  }
}
