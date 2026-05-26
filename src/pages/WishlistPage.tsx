import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from '../components/common/ProductCard'
import { SectionTitle } from '../components/common/SectionTitle'
import { StoreLayout } from '../components/layout/StoreLayout'
import { addToCart } from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export function WishlistPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const products = useAppSelector((state) => state.catalog.products)
  const catalogStatus = useAppSelector((state) => state.catalog.status)
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds)
  const wishlistProducts = products.filter((product) => wishlistIds.includes(product.id))
  const justForYou = products.filter((product) => !wishlistIds.includes(product.id)).slice(0, 4)
  const isLoadingSavedProducts =
    wishlistIds.length > 0 &&
    wishlistProducts.length === 0 &&
    (catalogStatus === 'idle' || catalogStatus === 'loading')

  function moveWishlistToCart() {
    if (!token) {
      navigate('/login')
      return
    }

    wishlistProducts.forEach((product) => dispatch(addToCart(product.id)))
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <div className="mb-10 flex items-center justify-between gap-6 max-[780px]:flex-col max-[780px]:items-stretch">
          <h1 className="m-0 text-[28px] font-medium">
            {t('wishlist.title')} ({wishlistProducts.length})
          </h1>
          <button
            className="inline-flex min-h-[52px] items-center justify-center rounded border border-[#999] bg-white px-[34px] font-semibold dark:border-neutral-700 dark:bg-neutral-900"
            type="button"
            onClick={moveWishlistToCart}
          >
            {t('wishlist.moveAll')}
          </button>
        </div>

        {isLoadingSavedProducts ? (
          <p className="rounded bg-[#f7f7f7] p-10 text-center dark:bg-neutral-900">{t('common.loading')}</p>
        ) : wishlistProducts.length ? (
          <div className="grid grid-cols-4 gap-[30px] max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded bg-[#f7f7f7] p-10 text-center dark:bg-neutral-900">{t('common.empty')}</p>
        )}

        <section className="mt-[78px] border-b border-[#e8e8e8] pb-[60px] dark:border-neutral-800">
          <SectionTitle
            eyebrow=""
            title={t('wishlist.justForYou')}
            action={<button className="inline-flex min-h-[52px] items-center justify-center rounded border border-[#999] bg-white px-[34px] font-semibold dark:border-neutral-700 dark:bg-neutral-900">{t('wishlist.seeAll')}</button>}
          />
          <div className="grid grid-cols-4 gap-[30px] max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
            {justForYou.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </StoreLayout>
  )
}
