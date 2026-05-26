import { SlidersHorizontal, X } from 'lucide-react'
import type { JSX } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/common/ProductCard'
import { StoreLayout } from '../components/layout/StoreLayout'
import { Pagination } from '../components/ui/pagination'
import { useAppSelector } from '../store/hooks'
import { cn } from '../lib/utils'

type BlockChildren = JSX.Element | JSX.Element[] | (JSX.Element | JSX.Element[])[]

export function ProductsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const products = useAppSelector((state) => state.catalog.products)
  const brands = useAppSelector((state) => state.catalog.brands)
  const categories = useAppSelector((state) => state.catalog.categories)
  const colors = useAppSelector((state) => state.catalog.colors)
  const [brandId, setBrandId] = useState<number | null>(null)
  const [colorId, setColorId] = useState<number | null>(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const search = searchParams.get('search')?.toLowerCase() ?? ''
  const categoryId = Number(searchParams.get('category')) || null
  const pageSize = 6

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(search)
    const matchesCategory = categoryId ? product.categoryId === categoryId : true
    const matchesBrand = brandId ? product.brandId === brandId : true
    const matchesColor = colorId ? product.colorId === colorId : true
    const matchesMin = minPrice ? product.price >= Number(minPrice) : true
    const matchesMax = maxPrice ? product.price <= Number(maxPrice) : true
    const matchesRating = rating ? (product.rating ?? 0) >= rating : true

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesColor &&
      matchesMin &&
      matchesMax &&
      matchesRating
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const activePage = Math.min(page, totalPages)
  const visibleProducts = filteredProducts.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize,
  )

  function clearFilters() {
    changeCategory(null)
    setBrandId(null)
    setColorId(null)
    setMinPrice('')
    setMaxPrice('')
    setRating(null)
  }

  function changeCategory(id: number | null) {
    const nextParams = new URLSearchParams(searchParams)

    if (id) {
      nextParams.set('category', String(id))
    } else {
      nextParams.delete('category')
    }

    setPage(1)
    setSearchParams(nextParams)
  }

  return (
    <StoreLayout>
      <main className="mx-auto max-w-[1170px] px-6 py-20 pb-36">
        <div className="mb-[70px] text-[#777]">Home / {t('products.title')}</div>

        <div className="mb-10 flex items-center justify-between gap-6 max-[780px]:flex-col max-[780px]:items-stretch">
          <h1 className="m-0 text-[28px] font-medium">{t('products.title')}</h1>
          <button type="button" className="inline-flex min-h-[52px] items-center gap-4 rounded border border-[#d0d0d0] bg-white px-5 dark:border-neutral-700 dark:bg-neutral-900">
            {t('products.sortPopular')}
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="grid grid-cols-[250px_minmax(0,1fr)] gap-[55px] max-[900px]:grid-cols-1">
          <aside className="grid content-start gap-7 max-[900px]:order-2" data-aos="fade-right">
            <FilterBlock title={t('products.category')}>
              <button
                type="button"
                className={cn('block w-full border-0 bg-transparent py-2 text-left text-[#555] dark:text-neutral-300', !categoryId && 'font-bold text-[#db4444]')}
                onClick={() => changeCategory(null)}
              >
                {t('products.allProducts')}
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  className={cn('block w-full border-0 bg-transparent py-2 text-left text-[#555] dark:text-neutral-300', categoryId === category.id && 'font-bold text-[#db4444]')}
                  key={category.id}
                  onClick={() => changeCategory(category.id)}
                >
                  {category.categoryName}
                </button>
              ))}
            </FilterBlock>

            <FilterBlock title={t('products.brands')}>
              {brands.map((brand) => (
                <label key={brand.id} className="relative mb-3 flex cursor-pointer items-center gap-2.5 text-[#555] dark:text-white">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={brandId === brand.id}
                    onChange={() => setBrandId(brandId === brand.id ? null : brand.id)}
                  />
                  <span className="flex h-5 w-5 rounded-md border border-[#a2a1a833] bg-[#e8e8e8] transition peer-checked:bg-[#7152f3] peer-checked:[&>svg]:stroke-white peer-checked:[&>svg]:opacity-100 dark:bg-[#212121]">
                    <svg className="h-5 w-5 stroke-[#e8e8e8] opacity-0 dark:stroke-[#212121]" fill="none" viewBox="0 0 24 24">
                      <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {brand.brandName}
                </label>
              ))}
            </FilterBlock>

            <FilterBlock title="Colors">
              {colors.map((color) => (
                <label key={color.id} className="relative mb-3 flex cursor-pointer items-center gap-2.5 text-[#555] dark:text-white">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={colorId === color.id}
                    onChange={() => setColorId(colorId === color.id ? null : color.id)}
                  />
                  <span className="flex h-5 w-5 rounded-md border border-[#a2a1a833] bg-[#e8e8e8] transition peer-checked:bg-[#7152f3] peer-checked:[&>svg]:stroke-white peer-checked:[&>svg]:opacity-100 dark:bg-[#212121]">
                    <svg className="h-5 w-5 stroke-[#e8e8e8] opacity-0 dark:stroke-[#212121]" fill="none" viewBox="0 0 24 24">
                      <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {color.colorName}
                </label>
              ))}
            </FilterBlock>

            <FilterBlock title={t('products.priceRange')}>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-900"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder={t('products.min')}
                  type="number"
                />
                <input
                  className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-900"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder={t('products.max')}
                  type="number"
                />
              </div>
            </FilterBlock>

            <FilterBlock title={t('products.ratings')}>
              {[5, 4, 3, 2].map((value) => (
                <label key={value} className="relative mb-3 flex cursor-pointer items-center gap-2.5 text-[#555] dark:text-white">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={rating === value}
                    onChange={() => setRating(rating === value ? null : value)}
                  />
                  <span className="flex h-5 w-5 rounded-md border border-[#a2a1a833] bg-[#e8e8e8] transition peer-checked:bg-[#7152f3] peer-checked:[&>svg]:stroke-white peer-checked:[&>svg]:opacity-100 dark:bg-[#212121]">
                    <svg className="h-5 w-5 stroke-[#e8e8e8] opacity-0 dark:stroke-[#212121]" fill="none" viewBox="0 0 24 24">
                      <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{'\u2605'.repeat(value)}</span>
                </label>
              ))}
            </FilterBlock>

            <button type="button" className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded border border-[#999] bg-white px-[34px] font-semibold dark:border-neutral-700 dark:bg-neutral-900" onClick={clearFilters}>
              <X size={16} />
              {t('common.clear')}
            </button>
          </aside>

          <section data-aos="fade-up">
            <div className="mb-6 flex min-h-[38px] flex-wrap gap-2.5">
              {categoryId ? <span className="inline-flex min-h-8 items-center rounded border border-[#db4444] px-3 text-[#db4444]">{categories.find((item) => item.id === categoryId)?.categoryName}</span> : null}
              {brandId ? <span className="inline-flex min-h-8 items-center rounded border border-[#db4444] px-3 text-[#db4444]">{brands.find((item) => item.id === brandId)?.brandName}</span> : null}
              {colorId ? <span className="inline-flex min-h-8 items-center rounded border border-[#db4444] px-3 text-[#db4444]">{colors.find((item) => item.id === colorId)?.colorName}</span> : null}
              {rating ? <span className="inline-flex min-h-8 items-center rounded border border-[#db4444] px-3 text-[#db4444]">{rating}+ {'\u2605'}</span> : null}
            </div>
            {filteredProducts.length ? (
              <>
                <div className="grid grid-cols-3 gap-[30px] max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination page={activePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            ) : (
              <p className="rounded bg-[#f7f7f7] p-10 text-center dark:bg-neutral-900">{t('products.noResults')}</p>
            )}
          </section>
        </div>
      </main>
    </StoreLayout>
  )
}

function FilterBlock({
  title,
  children,
}: {
  title: string
  children: BlockChildren
}) {
  return (
    <div className="border-t border-[#e3e3e3] pt-4 dark:border-neutral-800">
      <h3 className="mb-4 text-base font-bold">{title}</h3>
      <div>{children}</div>
    </div>
  )
}
