import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Product } from '../../api/productApi'
import { getImageUrl } from '../../utils/images'
import 'swiper/css'
import 'swiper/css/pagination'

export function HeroProductSlider({ products }: { products: Product[] }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const slides = products.slice(0, 5)

  if (!slides.length) {
    return (
      <section className="grid h-[344px] place-items-center bg-black text-white max-[780px]:h-[560px]">
        <h1 className="text-5xl font-semibold">Fastcart products</h1>
      </section>
    )
  }

  return (
    <section className="relative h-[344px] overflow-hidden bg-black text-white max-[780px]:h-[560px]" aria-label="Featured products">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={slides.length > 1}
        className="home-hero-swiper h-full"
      >
        {slides.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="grid h-full grid-cols-[43%_57%] items-center bg-black max-[780px]:grid-cols-1 max-[780px]:grid-rows-[auto_1fr]">
              <div className="pl-16 max-[780px]:px-7 max-[780px]:pt-9">
                <div className="mb-5 flex items-center gap-3.5 text-[15px] text-white">
                  <span>{product.categoryName ?? 'Featured product'}</span>
                </div>
                <h1 className="mb-5 max-w-[340px] text-5xl font-semibold leading-tight max-[780px]:text-4xl">{product.productName}</h1>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border-b border-current bg-transparent pb-1 text-[15px]"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {t('hero.shopNow')}
                  <ArrowRight size={17} />
                </button>
              </div>

              <div className="flex h-full items-center justify-end pr-7 max-[780px]:justify-center max-[780px]:px-5 max-[780px]:pb-12">
                <img className="block max-h-[98%] max-w-full object-contain" src={getImageUrl(product.image)} alt={product.productName} draggable={false} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
