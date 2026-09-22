// Compresses an image file in the browser (via canvas) and returns a JPEG
// data URL small enough to fit as a single Firestore field. This is how
// newspaper page photos get stored — no Firebase Storage involved, so no
// Blaze plan is needed. Firestore's own hard limit is 1MiB per document;
// we aim well under that to leave room for the doc's other fields and for
// Firestore's base64 storage overhead.

const MAX_RAW_BYTES = 650_000 // ~650KB of actual image data
const DIMENSION_STEPS = [1600, 1200, 900, 700]
const QUALITY_STEPS = [0.75, 0.6, 0.45, 0.3]

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Could not read that image file.'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Could not read that image file.'))
    reader.readAsDataURL(file)
  })
}

function estimateRawBytesFromDataUrl(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.floor(base64.length * 0.75)
}

export async function compressImageToDataUrl(file) {
  const img = await loadImage(file)

  for (const maxDim of DIMENSION_STEPS) {
    const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1)
    const width = Math.round(img.width * ratio)
    const height = Math.round(img.height * ratio)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(img, 0, 0, width, height)

    for (const quality of QUALITY_STEPS) {
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      if (estimateRawBytesFromDataUrl(dataUrl) <= MAX_RAW_BYTES) {
        return dataUrl
      }
    }
  }

  throw new Error(
    'This image is too large even after compression. Please try a smaller photo or crop it closer to the page.'
  )
}
