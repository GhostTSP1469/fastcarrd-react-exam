import { Eye, Heart, ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../api/productApi'
import { addToCart } from '../../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleWishlistProduct } from '../../store/wishlistSlice'
import { cn } from '../../lib/utils'
import { getImageUrl } from '../../utils/images'

function Stars({ rating }: { rating: number }) {
  const filledStars = Math.round(rating)

  return (
    <span className="inline-flex" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= filledStars ? 'text-[#ffad33]' : 'text-[#b5b5b5]'}>
          {'\u2605'}
        </span>
      ))}
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const wishlist = useAppSelector((state) => state.wishlist.productIds)
  const isWishlisted = wishlist.includes(product.id)
  const price = product.hasDiscount && product.discountPrice
    ? product.discountPrice
    : product.price
  const discountPercent = product.hasDiscount && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  function addProductToCart() {
    if (!token) {
      navigate('/login')
      return
    }

    dispatch(addToCart(product.id))
  }

  return (
    <article
      className="group min-w-0"
      data-aos="fade-up"
      data-aos-delay={String((product.id % 4) * 60)}
    >
      <div className="relative h-[250px] overflow-hidden bg-[#f5f5f5] dark:bg-neutral-900">
        {discountPercent > 0 ? (
          <span className="absolute left-3 top-3 z-10 min-w-[54px] rounded bg-[#db4444] px-2.5 py-1 text-center text-xs text-white">
            -{discountPercent}%
          </span>
        ) : null}
        <button
          type="button"
          className={cn(
            'absolute right-3 top-3 z-10 inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-[#111] dark:bg-neutral-800 dark:text-white',
            isWishlisted && 'text-[#db4444] dark:text-[#db4444]',
          )}
          onClick={() => dispatch(toggleWishlistProduct(product.id))}
          aria-label={t('product.toggleWishlist')}
        >
          <Heart size={18} />
        </button>
        <button
          type="button"
          className="absolute right-3 top-[54px] z-10 inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-[#111] dark:bg-neutral-800 dark:text-white"
          onClick={() => navigate(`/product/${product.id}`)}
          aria-label={t('product.view')}
        >
          <Eye size={18} />
        </button>
        <img className="h-full w-full object-contain p-7" src={getImageUrl(product.image)} alt={product.productName} />
        <button
          type="button"
          className="absolute inset-x-0 bottom-0 flex h-[42px] translate-y-full items-center justify-center gap-2.5 bg-black text-white transition group-hover:translate-y-0"
          onClick={addProductToCart}
        >
          <ShoppingCart size={18} />
          {t('product.addToCart')}
        </button>
      </div>
      <button
        type="button"
        className="mt-4 block border-0 bg-transparent p-0 text-left text-base font-semibold text-[#111] dark:text-white"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {product.productName}
      </button>
      <div className="mt-2 flex gap-3 font-semibold">
        <span className="text-[#db4444]">${price}</span>
        {product.hasDiscount && product.discountPrice ? (
          <span className="text-[#7d7d7d] line-through">${product.price}</span>
        ) : null}
      </div>
      <div className="mt-2 flex gap-2 font-semibold text-[#7d7d7d]">
        <Stars rating={product.rating ?? 4} />
        <span>({product.quantity ?? 0})</span>
      </div>
    </article>
  )
}
