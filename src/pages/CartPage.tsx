import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { clearUserCart, increaseCartProduct, reduceCartProduct, removeCartProduct } from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { StoreLayout } from '../components/layout/StoreLayout'
import { getImageUrl } from '../utils/images'

export function CartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const cartItems = useAppSelector((state) => state.cart.items)
  const products = useAppSelector((state) => state.catalog.products)
  const catalogStatus = useAppSelector((state) => state.catalog.status)
  const rows = cartItems
    .map((item) => ({
      item,
      product: products.find((product) => product.id === item.productId),
    }))
    .filter((row) => row.product)
  const subtotal = rows.reduce(
    (sum, row) => {
      const product = row.product
      const price = product?.hasDiscount && product.discountPrice
        ? product.discountPrice
        : product?.price ?? 0

      return sum + price * row.item.quantity
    },
    0,
  )
  const isLoadingSavedProducts =
    cartItems.length > 0 &&
    rows.length === 0 &&
    (catalogStatus === 'idle' || catalogStatus === 'loading')

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [navigate, token])

  if (!token) {
    return null
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <div className="mb-[70px] text-[#777]">Home / {t('cart.title')}</div>
        {isLoadingSavedProducts ? (
          <div className="rounded bg-[#f7f7f7] p-10 text-center dark:bg-neutral-900">
            <p>{t('common.loading')}</p>
          </div>
        ) : rows.length ? (
          <>
            <div className="grid">
              <div className="mb-3.5 grid min-h-[72px] grid-cols-[2fr_1fr_1fr_1fr] items-center px-[42px] max-[760px]:hidden">
                <span>{t('cart.product')}</span>
                <span>{t('cart.price')}</span>
                <span>{t('cart.quantity')}</span>
                <span>{t('cart.subtotal')}</span>
              </div>
              {rows.map(({ item, product }) =>
                product ? (
                  <div key={product.id} className="mb-[30px] grid min-h-[100px] grid-cols-[2fr_1fr_1fr_1fr] items-center px-[42px] py-5 shadow-[0_2px_14px_rgb(0_0_0_/_8%)] dark:bg-neutral-900 max-[760px]:grid-cols-1 max-[760px]:gap-4 max-[760px]:px-5">
                    <div className="flex items-center gap-[18px]">
                      <img className="h-[58px] w-[58px] object-contain" src={getImageUrl(product.image)} alt="" />
                      <b>{product.productName}</b>
                    </div>
                    <span>${product.hasDiscount && product.discountPrice ? product.discountPrice : product.price}</span>
                    <div className="flex w-32 max-w-[8rem] items-center overflow-hidden rounded-lg">
                      <button
                        type="button"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-l-lg border border-[#d1d5db] bg-[#f3f4f6] text-[#111827] transition hover:bg-[#e5e7eb] dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                        aria-label="Decrease quantity"
                        onClick={() => dispatch(reduceCartProduct(product.id))}
                      >
                        <svg className="h-3 w-3" aria-hidden="true" fill="none" viewBox="0 0 18 2">
                          <path d="M1 1h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </button>
                      <input className="h-11 min-w-0 w-10 border-y border-[#d1d5db] bg-[#f9fafb] text-center text-sm outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white" aria-label="Product quantity" value={item.quantity} readOnly />
                      <button
                        type="button"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-r-lg border border-[#d1d5db] bg-[#f3f4f6] text-[#111827] transition hover:bg-[#e5e7eb] dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                        aria-label="Increase quantity"
                        onClick={() => dispatch(increaseCartProduct(product.id))}
                      >
                        <svg className="h-3 w-3" aria-hidden="true" fill="none" viewBox="0 0 18 18">
                          <path d="M9 1v16M1 9h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <b>${(product.hasDiscount && product.discountPrice ? product.discountPrice : product.price) * item.quantity}</b>
                      <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border-0 bg-[#db4444] text-white" type="button" onClick={() => dispatch(removeCartProduct(product.id))}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : null,
              )}
            </div>

            <div className="mb-20 mt-6 flex items-center justify-between gap-6 max-[760px]:flex-col max-[760px]:items-stretch">
              <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded border border-[#999] bg-white px-[34px] font-semibold dark:border-neutral-700 dark:bg-neutral-900" onClick={() => navigate('/products')}>
                {t('cart.returnToShop')}
              </button>
              <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded border border-[#db4444] bg-white px-[34px] font-semibold text-[#db4444] dark:bg-neutral-900" onClick={() => dispatch(clearUserCart())}>
                {t('cart.removeAll')}
              </button>
            </div>

            <div className="flex items-start justify-between gap-10 max-[760px]:flex-col">
              <form className="flex gap-4 max-[760px]:w-full max-[760px]:flex-col">
                <input className="min-h-[54px] w-[300px] rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-900 max-[760px]:w-full" placeholder={t('cart.coupon')} />
                <button className="min-h-[54px] rounded bg-[#db4444] px-8 font-semibold text-white" type="button">{t('common.apply')}</button>
              </form>
              <aside className="w-[470px] border border-[#999] p-6 dark:border-neutral-700 max-[760px]:w-full">
                <h2 className="mb-6 text-xl font-semibold">{t('cart.cartTotal')}</h2>
                <div className="flex justify-between border-b border-[#d8d8d8] py-4 dark:border-neutral-700">
                  <span>{t('cart.subtotal')}:</span>
                  <b>${subtotal}</b>
                </div>
                <div className="flex justify-between border-b border-[#d8d8d8] py-4 dark:border-neutral-700">
                  <span>{t('cart.shipping')}:</span>
                  <b>{t('cart.free')}</b>
                </div>
                <div className="flex justify-between py-4">
                  <span>{t('cart.total')}:</span>
                  <b>${subtotal}</b>
                </div>
                <button type="button" className="mx-auto mt-4 flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white" onClick={() => navigate(token ? '/checkout' : '/login')}>
                  {t('cart.checkout')}
                </button>
              </aside>
            </div>
          </>
        ) : (
          <div className="rounded bg-[#f7f7f7] p-10 text-center dark:bg-neutral-900">
            <p>{t('cart.empty')}</p>
            <button type="button" className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white" onClick={() => navigate('/products')}>
              {t('cart.returnToShop')}
            </button>
          </div>
        )}
      </main>
    </StoreLayout>
  )
}
