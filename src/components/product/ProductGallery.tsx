import { useState } from 'react'
import { cn } from '../../lib/utils'
import { getImageUrl } from '../../utils/images'

export function ProductGallery({
  images,
  productName,
}: {
  images: string[]
  productName: string
}) {
  const [selectedImage, setSelectedImage] = useState('')
  const activeImage = images.includes(selectedImage) ? selectedImage : images[0] ?? ''

  return (
    <>
      <div className="grid content-start gap-4">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={cn(
              'h-[150px] rounded bg-[#f5f5f5] p-4 ring-1 ring-transparent dark:bg-neutral-900',
              activeImage === image && 'ring-[#db4444]',
            )}
            onClick={() => setSelectedImage(image)}
          >
            <img className="h-full w-full object-contain" src={getImageUrl(image)} alt="" />
          </button>
        ))}
      </div>

      <div className="grid h-[600px] place-items-center bg-[#f5f5f5] p-8 dark:bg-neutral-900 max-[760px]:h-[360px]">
        <img className="h-full w-full object-contain" src={getImageUrl(activeImage)} alt={productName} />
      </div>
    </>
  )
}
