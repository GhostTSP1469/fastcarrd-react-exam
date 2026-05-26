import logotipe from '../assets/logotipe.png'
import { serverUrl } from './apiUrl'

export function getImageUrl(image?: string | null) {
  if (!image) {
    return logotipe
  }

  if (image.startsWith('http') || image.startsWith('/')) {
    return image
  }

  return `${serverUrl}/images/${image}`
}
