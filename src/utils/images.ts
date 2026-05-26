import logotipe from '../assets/logotipe.png'

const apiUrl = import.meta.env.VITE_API_URL
const serverUrl = apiUrl.replace(/\/api\/?$/, '')

export function getImageUrl(image?: string | null) {
  if (!image) {
    return logotipe
  }

  if (image.startsWith('http') || image.startsWith('/')) {
    return image
  }

  return `${serverUrl}/images/${image}`
}
