import { Heart, Minus, Plus, RotateCcw, Truck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/common/ProductCard'
import { SectionTitle } from '../components/common/SectionTitle'
import { StoreLayout } from '../components/layout/StoreLayout'
import { ProductGallery } from '../components/product/ProductGallery'
import { addToCart } from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleWishlistProduct } from '../store/wishlistSlice'
import { cn } from '../lib/utils'
import { getColorValue } from '../utils/colors'

function getProductSizes(size?: string | null) {
  const sizes = size
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return sizes?.length ? sizes : ['M']
}

export function ProductDetailsPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const products = useAppSelector((state) => state.catalog.products)
  const colors = useAppSelector((state) => state.catalog.colors)
  const product = products.find((item) => item.id === Number(id)) ?? products[0]
  const related = products.filter((item) => item.id !== product?.id).slice(0, 4)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColorId, setSelectedColorId] = useState('')
  const gallery: string[] = []
  const rating = Math.round(product?.rating ?? 4)
  const price = product?.hasDiscount && product.discountPrice
    ? product.discountPrice
    : product?.price
  const productColor = product?.color ?? colors.find((color) => color.id === product?.colorId)
  const productColors = productColor ? [productColor] : []
  const sizes = getProductSizes(product?.size)
  const activeSize = sizes.includes(selectedSize) ? selectedSize : sizes[0]
  const activeColorId = selectedColorId || String(productColor?.id ?? '')

  if (!product) {
    return null
  }

  if (product.images?.length) {
    product.images.forEach((image) => {
      if (image) {
        gallery.push(image)
      }
    })
  }

  if (!gallery.length && product.image) {
    gallery.push(product.image)
  }

  function addSelectedToCart() {
    if (!token) {
      navigate('/login')
      return false
    }

    for (let index = 0; index < quantity; index += 1) {
      dispatch(addToCart(product.id))
    }

    return true
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <div className="mb-[70px] text-[#777]">Account / Gaming / {product.productName}</div>
        <section className="grid grid-cols-[170px_1fr_550px] gap-10 max-[1050px]:grid-cols-[120px_1fr] max-[760px]:grid-cols-1">
          <ProductGallery images={gallery} productName={product.productName} />

          <div>
            <h1 className="mb-4 text-4xl font-semibold">{product.productName}</h1>
            <div className="mb-7 flex items-center gap-4">
              <span className="text-[#ffad33]">{'\u2605'.repeat(rating)}</span>
              <span>{product.categoryName}</span>
              <b className="text-[#00a650]">{t('product.inStock')}</b>
            </div>
            <strong className="mb-8 block text-4xl">${price}</strong>
            <p className="mb-8 border-b border-[#d8d8d8] pb-6 dark:border-neutral-700">{product.description}</p>

            <div className="mb-6 flex items-center gap-4">
              <span>{t('product.colours')}:</span>
              {productColors.length ? (
                productColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    className={cn(
                      'h-[22px] w-[22px] rounded-full border-2 border-white shadow-[0_0_0_1px_#999]',
                      activeColorId === String(color.id) && 'shadow-[0_0_0_3px_#db4444]',
                    )}
                    style={{ backgroundColor: getColorValue(color.colorName) }}
                    aria-label={color.colorName}
                    title={color.colorName}
                    onClick={() => setSelectedColorId(String(color.id))}
                  />
                ))
              ) : (
                <span className="text-[#777]">No color</span>
              )}
            </div>

            <div className="mb-8 flex items-center gap-4">
              <span>{t('product.size')}:</span>
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={cn(
                    'min-h-11 min-w-11 rounded border border-[#999] bg-white px-3 dark:bg-neutral-900',
                    activeSize === size && 'border-[#db4444] bg-[#db4444] text-white dark:bg-[#db4444]',
                  )}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="mb-8 flex gap-4">
              <div className="flex h-[52px] overflow-hidden rounded border border-[#999]">
                <button className="inline-flex w-12 items-center justify-center bg-white dark:bg-neutral-900" type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={18} />
                </button>
                <span className="inline-flex w-12 items-center justify-center bg-white dark:bg-neutral-900">{quantity}</span>
                <button className="inline-flex w-12 items-center justify-center bg-[#db4444] text-white" type="button" onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={20} />
                </button>
              </div>
              <button
                type="button"
                className="inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white"
                onClick={() => {
                  if (addSelectedToCart()) {
                    navigate('/cart')
                  }
                }}
              >
                {t('product.buyNow')}
              </button>
              <button
                type="button"
                className="inline-flex h-[52px] w-[52px] items-center justify-center rounded border border-[#999] bg-white dark:bg-neutral-900"
                onClick={() => dispatch(toggleWishlistProduct(product.id))}
              >
                <Heart size={24} />
              </button>
            </div>

            <div className="mt-7 rounded border border-[#999] dark:border-neutral-700">
              <div className="flex gap-4 p-5">
                <Truck size={30} />
                <span>
                  <b className="block">{t('product.freeDelivery')}</b>
                  <small className="block">{t('product.deliveryText')}</small>
                </span>
              </div>
              <div className="flex gap-4 border-t border-[#999] p-5 dark:border-neutral-700">
                <RotateCcw size={30} />
                <span>
                  <b className="block">{t('product.returnDelivery')}</b>
                  <small className="block">{t('product.returnText')}</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-[78px] border-b border-[#e8e8e8] pb-[60px] dark:border-neutral-800">
          <SectionTitle eyebrow="" title={t('product.related')} />
          <div className="grid grid-cols-4 gap-[30px] max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </main>
    </StoreLayout>
  )
}
