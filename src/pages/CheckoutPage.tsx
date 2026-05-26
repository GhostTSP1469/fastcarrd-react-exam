import { Field, Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { StoreLayout } from '../components/layout/StoreLayout'
import { clearUserCart } from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getImageUrl } from '../utils/images'

type CheckoutValues = {
  firstName: string
  lastName: string
  street: string
  apartment: string
  city: string
  phone: string
  email: string
}

const initialValues: CheckoutValues = {
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  phone: '',
  email: '',
}

export function CheckoutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const cartItems = useAppSelector((state) => state.cart.items)
  const products = useAppSelector((state) => state.catalog.products)
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
        <div className="mb-[70px] text-[#777]">Product / View Cart / CheckOut</div>
        <h1 className="mb-7 text-4xl font-medium">{t('checkout.title')}</h1>
        <div className="grid grid-cols-[1fr_430px] gap-20 max-[900px]:grid-cols-1">
          <Formik
            initialValues={initialValues}
            onSubmit={() => {
              dispatch(clearUserCart())
              navigate('/account')
            }}
          >
            <Form className="grid gap-5 rounded bg-white p-7 shadow-[0_2px_22px_rgb(0_0_0_/_10%)] dark:bg-neutral-900">
              {[
                ['firstName', t('checkout.firstName')],
                ['lastName', t('checkout.lastName')],
                ['street', t('checkout.street')],
                ['apartment', t('checkout.apartment')],
                ['city', t('checkout.city')],
                ['phone', t('checkout.phone')],
                ['email', t('checkout.email')],
              ].map(([name, label]) => (
                <Field className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" key={name} name={name} placeholder={label} />
              ))}
              <label className="relative flex cursor-pointer items-center gap-2.5">
                <input className="peer sr-only" type="checkbox" defaultChecked />
                <span className="flex h-5 w-5 rounded-md border border-[#a2a1a833] bg-[#e8e8e8] transition peer-checked:bg-[#7152f3] peer-checked:[&>svg]:stroke-white peer-checked:[&>svg]:opacity-100 dark:bg-[#212121]">
                  <svg className="h-5 w-5 stroke-[#e8e8e8] opacity-0 dark:stroke-[#212121]" fill="none" viewBox="0 0 24 24">
                    <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t('checkout.saveInfo')}
              </label>
            </Form>
          </Formik>

          <aside className="grid content-start gap-4">
            {rows.map(({ item, product }) =>
              product ? (
                <div key={product.id} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3">
                    <img className="h-12 w-12 object-contain" src={getImageUrl(product.image)} alt="" />
                    {product.productName}
                  </span>
                  <b>${(product.hasDiscount && product.discountPrice ? product.discountPrice : product.price) * item.quantity}</b>
                </div>
              ) : null,
            )}
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
            <label className="flex items-center gap-3">
              <input type="radio" name="payment" />
              {t('checkout.bank')}
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="payment" defaultChecked />
              {t('checkout.cash')}
            </label>
            <form className="flex gap-4">
              <input className="min-h-[54px] min-w-0 flex-1 rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" placeholder={t('cart.coupon')} />
              <button className="min-h-[54px] rounded bg-[#db4444] px-6 font-semibold text-white" type="button">{t('common.apply')}</button>
            </form>
            <button
              type="button"
              className="inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white"
              onClick={() => {
                dispatch(clearUserCart())
                navigate('/account')
              }}
            >
              {t('checkout.placeOrder')}
            </button>
          </aside>
        </div>
      </main>
    </StoreLayout>
  )
}
