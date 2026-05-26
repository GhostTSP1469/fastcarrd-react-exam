import { Camera, Gamepad2, Headphones, Monitor, Smartphone, Watch } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CountdownTimer } from '../components/common/CountdownTimer'
import { ProductCard } from '../components/common/ProductCard'
import { SectionTitle } from '../components/common/SectionTitle'
import { ServiceFeatures } from '../components/common/ServiceFeatures'
import { HeroProductSlider } from '../components/home/HeroProductSlider'
import { StoreLayout } from '../components/layout/StoreLayout'
import { useAppSelector } from '../store/hooks'
import { getImageUrl } from '../utils/images'

const categoryIcons = [Smartphone, Monitor, Watch, Camera, Headphones, Gamepad2]

function getDiscountPercent(price: number, discountPrice?: number | null) {
  if (!discountPrice || discountPrice >= price) {
    return 0
  }

  return Math.round(((price - discountPrice) / price) * 100)
}

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const products = useAppSelector((state) => state.catalog.products)
  const categories = useAppSelector((state) => state.catalog.categories)
  const discountedProducts = products
    .filter((product) => product.hasDiscount && product.discountPrice)
    .sort((first, second) => {
      return (
        getDiscountPercent(second.price, second.discountPrice) -
        getDiscountPercent(first.price, first.discountPrice)
      )
    })
  const flashProducts = discountedProducts.length ? discountedProducts.slice(0, 4) : products.slice(0, 4)
  const bestProducts = products.slice(4, 8)
  const exploreProducts = products.slice(8, 16)
  const promoProduct = discountedProducts[0] ?? products[0]
  const arrivalProducts = products.slice(0, 4)

  return (
    <StoreLayout>
      <main>
        <section className="mx-auto grid max-w-[1170px] grid-cols-[220px_minmax(0,1fr)] gap-[46px] px-6 pt-[38px] max-[860px]:grid-cols-1" data-aos="fade-right">
          <aside className="grid content-start gap-4 border-r border-[#d8d8d8] pr-[18px] max-[860px]:grid-cols-2 max-[860px]:border-b max-[860px]:border-r-0 max-[860px]:pb-6 max-[860px]:pr-0">
            {categories.map((category) => (
              <button
                className="border-0 bg-transparent p-0 text-left text-sm transition hover:text-[#db4444]"
                key={category.id}
                type="button"
                onClick={() => navigate(`/products?category=${category.id}`)}
              >
                {category.categoryName}
              </button>
            ))}
          </aside>
          <div data-aos="fade-left">
            <HeroProductSlider products={products} />
          </div>
        </section>

        <section className="mx-auto mt-[78px] max-w-[1170px] border-b border-[#e8e8e8] px-6 pb-[60px] dark:border-neutral-800">
          <SectionTitle
            eyebrow={t('home.today')}
            title={t('home.flashSales')}
            action={<CountdownTimer />}
          />
          <div className="grid grid-cols-4 gap-[30px] max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
            {flashProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-[42px] flex justify-center">
            <button className="inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white" type="button" onClick={() => navigate('/products')}>
              {t('common.viewAllProducts')}
            </button>
          </div>
        </section>

        <section className="mx-auto mt-[78px] max-w-[1170px] border-b border-[#e8e8e8] px-6 pb-[60px] dark:border-neutral-800">
          <SectionTitle eyebrow={t('home.categories')} title={t('home.browse')} />
          <div className="grid grid-cols-6 gap-[30px] max-[1000px]:grid-cols-3 max-[620px]:grid-cols-2">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length]

              return (
                <button
                  key={category.id}
                  type="button"
                  className="grid h-[145px] place-items-center gap-3.5 rounded border border-[#d8d8d8] bg-white transition hover:border-[#db4444] hover:bg-[#db4444] hover:text-white dark:border-neutral-700 dark:bg-neutral-950"
                  onClick={() => navigate(`/products?category=${category.id}`)}
                >
                  <Icon size={32} />
                  <span>{category.categoryName}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mx-auto mt-[78px] max-w-[1170px] border-b border-[#e8e8e8] px-6 pb-[60px] dark:border-neutral-800">
          <SectionTitle
            eyebrow={t('home.month')}
            title={t('home.bestSelling')}
            action={
              <button type="button" className="inline-flex min-h-[46px] items-center justify-center rounded bg-[#db4444] px-[26px] font-semibold text-white" onClick={() => navigate('/products')}>
                {t('common.viewAll')}
              </button>
            }
          />
          <div className="grid grid-cols-4 gap-[30px] max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
            {bestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-[70px] grid min-h-[500px] max-w-[1170px] grid-cols-[42%_58%] items-center bg-black p-14 text-white max-[780px]:grid-cols-1 max-[780px]:p-8" data-aos="zoom-in">
          <div>
            <span className="font-bold text-[#00ff66]">{promoProduct?.categoryName ?? t('home.promoCategory')}</span>
            <h2 className="my-7 max-w-[440px] text-5xl leading-tight max-[780px]:text-[34px]">{promoProduct?.productName ?? t('home.promoTitle')}</h2>
            <CountdownTimer variant="promo" />
            <button
              type="button"
              className="min-h-[52px] rounded bg-[#00ff66] px-[34px] font-bold text-black"
              onClick={() => navigate(promoProduct ? `/product/${promoProduct.id}` : '/products')}
            >
              {t('home.buyNow')}
            </button>
          </div>
          <img className="max-h-[380px] w-full object-contain" src={getImageUrl(promoProduct?.image)} alt={promoProduct?.productName ?? ''} />
        </section>

        <section className="mx-auto mt-[78px] max-w-[1170px] border-b border-[#e8e8e8] px-6 pb-[60px] dark:border-neutral-800">
          <SectionTitle eyebrow={t('home.ourProducts')} title={t('home.explore')} />
          <div className="grid grid-cols-4 gap-[30px] max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
            {exploreProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-[42px] flex justify-center">
            <button className="inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white" type="button" onClick={() => navigate('/products')}>
              {t('common.viewAllProducts')}
            </button>
          </div>
        </section>

        <section className="mx-auto mt-[78px] max-w-[1170px] border-b border-[#e8e8e8] px-6 pb-[60px] dark:border-neutral-800">
          <SectionTitle eyebrow={t('home.featured')} title={t('home.newArrival')} />
          <div className="grid grid-cols-2 grid-rows-2 gap-[30px] max-[780px]:grid-cols-1 max-[780px]:grid-rows-none">
            {arrivalProducts.map((product, index) => (
              <article
                key={product.id}
                className={`flex min-h-[284px] flex-col justify-end bg-[#111] bg-contain bg-center bg-no-repeat p-7 text-white ${index === 0 ? 'row-span-2' : ''}`}
                data-aos={index === 0 ? 'fade-right' : 'fade-up'}
                style={{ backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 15%), rgb(0 0 0 / 78%)), url(${getImageUrl(product.image)})` }}
              >
                <h3 className="mb-2 text-2xl font-bold">{product.productName}</h3>
                <button className="w-fit border-b border-white bg-transparent pb-1" type="button" onClick={() => navigate(`/product/${product.id}`)}>
                  {t('hero.shopNow')}
                </button>
              </article>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-[1170px] px-6">
          <ServiceFeatures />
        </div>
      </main>
    </StoreLayout>
  )
}
