import { Heart, Menu, Moon, Search, ShoppingCart, Sun, User } from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logotipe from '../../assets/logotipe.png'
import { logout } from '../../store/authSlice'
import { fetchCatalog } from '../../store/catalogSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { cn } from '../../lib/utils'
import { LogoutButton } from '../common/LogoutButton'
import { Switch } from '../ui/switch'

export function StoreLayout({ children }: { children: JSX.Element }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark',
  )
  const token = useAppSelector((state) => state.auth.token)
  const savedCartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  )
  const cartCount = token ? savedCartCount : 0
  const wishlistCount = useAppSelector((state) => state.wishlist.productIds.length)
  const catalogStatus = useAppSelector((state) => state.catalog.status)
  const isAccountPage = location.pathname === '/account'

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/about', label: t('nav.about') },
  ]

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    })
  }, [])

  useEffect(() => {
    AOS.refreshHard()
  }, [catalogStatus, location.pathname])

  useEffect(() => {
    if (catalogStatus === 'idle') {
      void dispatch(fetchCatalog())
    }
  }, [catalogStatus, dispatch])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function submitSearch(event: { preventDefault: () => void }) {
    event.preventDefault()
    navigate(`/products?search=${encodeURIComponent(search)}`)
  }

  function changeLanguage() {
    void i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en')
  }

  return (
    <div className="min-h-screen bg-white text-[#111] dark:bg-[#111] dark:text-[#f5f5f5]">
      <header className="sticky top-0 z-50 border-b border-[#e8e8e8] bg-white dark:border-neutral-800 dark:bg-[#111]">
        <div className="mx-auto grid min-h-[82px] max-w-[1170px] grid-cols-[auto_1fr_auto] items-center gap-9 px-6 max-[1050px]:gap-4">
          <button className="hidden h-9 w-9 items-center justify-center max-[780px]:inline-flex" type="button" aria-label="Menu">
            <Menu size={22} />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 border-0 bg-transparent p-0 text-2xl font-extrabold"
            onClick={() => navigate('/')}
            aria-label="Fastcart"
          >
            <img className="h-[34px] w-[34px] object-contain" src={logotipe} alt="Fastcart" />
            <span>fastcart</span>
          </button>

          <nav className="flex items-center justify-center gap-9 text-base max-[920px]:hidden" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'border-b border-transparent py-1 transition hover:border-current',
                    isActive && 'border-current',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {token && !isAccountPage ? (
              <LogoutButton
                text={t('nav.logout')}
                onClick={() => {
                  dispatch(logout())
                  navigate('/login')
                }}
              />
            ) : !token ? (
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  cn(
                    'border-b border-transparent py-1 transition hover:border-current',
                    isActive && 'border-current',
                  )
                }
              >
                {t('nav.signUp')}
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            <form className="flex h-10 w-[250px] items-center bg-[#f5f5f5] dark:bg-neutral-800 max-[1150px]:hidden" onSubmit={submitSearch}>
              <input
                className="min-w-0 flex-1 border-0 bg-transparent px-4 text-[13px] outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('nav.searchPlaceholder')}
              />
              <button className="inline-flex h-10 w-10 items-center justify-center" type="submit" aria-label={t('common.search')}>
                <Search size={20} />
              </button>
            </form>

            <button
              className="relative inline-flex h-8 w-8 items-center justify-center"
              type="button"
              onClick={() => navigate('/wishlist')}
              aria-label={t('nav.wishlist')}
            >
              <Heart size={23} />
              {wishlistCount ? (
                <span className="absolute -right-1 -top-1 h-[18px] min-w-[18px] rounded-full bg-[#db4444] text-center text-[11px] leading-[18px] text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </button>

            <button
              className="relative inline-flex h-8 w-8 items-center justify-center"
              type="button"
              onClick={() => navigate(token ? '/cart' : '/login')}
              aria-label={t('nav.cart')}
            >
              <ShoppingCart size={24} />
              {cartCount ? (
                <span className="absolute -right-1 -top-1 h-[18px] min-w-[18px] rounded-full bg-[#db4444] text-center text-[11px] leading-[18px] text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>

            <button
              className="inline-flex h-[34px] w-[34px] items-center justify-center"
              type="button"
              onClick={() => navigate(token ? '/account' : '/login')}
              aria-label={t('nav.account')}
            >
              <User size={24} />
            </button>

            <button
              type="button"
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded border border-[#cfcfcf] text-xs font-semibold dark:border-neutral-700"
              onClick={changeLanguage}
            >
              {i18n.language === 'en' ? 'RU' : 'EN'}
            </button>

            <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-900" aria-label="Theme mode">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
        </div>
      </header>

      {children}

      <footer className="bg-black pt-20 text-white">
        <div className="mx-auto grid max-w-[1170px] grid-cols-[1.3fr_1fr_0.8fr_0.8fr_0.8fr] gap-16 px-6 pb-16 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          <div>
            <h3 className="mb-6 text-2xl font-bold">Exclusive</h3>
            <h4 className="mb-5 text-xl font-medium">{t('footer.subscribe')}</h4>
            <p className="mb-4 text-sm text-neutral-200">{t('footer.discount')}</p>
            <form className="flex h-12 max-w-[220px] items-center rounded border border-white">
              <input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-neutral-400" placeholder={t('footer.emailPlaceholder')} />
              <button className="h-12 w-12" type="button">-&gt;</button>
            </form>
          </div>
          <div className="grid content-start gap-3 text-sm text-neutral-200">
            <h3 className="mb-3 text-xl font-medium text-white">{t('footer.support')}</h3>
            <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
            <p>exclusive@gmail.com</p>
            <p>+88015-88888-9999</p>
          </div>
          <div className="grid content-start gap-3 text-sm text-neutral-200">
            <h3 className="mb-3 text-xl font-medium text-white">{t('footer.account')}</h3>
            <NavLink to="/account">{t('nav.account')}</NavLink>
            <NavLink to="/cart">{t('nav.cart')}</NavLink>
            <NavLink to="/wishlist">{t('nav.wishlist')}</NavLink>
            <NavLink to="/products">{t('footer.shop')}</NavLink>
          </div>
          <div className="grid content-start gap-3 text-sm text-neutral-200">
            <h3 className="mb-3 text-xl font-medium text-white">{t('footer.quickLink')}</h3>
            <a>{t('footer.privacy')}</a>
            <a>{t('footer.terms')}</a>
            <a>{t('footer.faq')}</a>
            <NavLink to="/contact">{t('nav.contact')}</NavLink>
          </div>
          <div>
            <h3 className="mb-6 text-xl font-medium">{t('footer.social')}</h3>
            <div className="flex gap-4">
              <span>f</span>
              <span>x</span>
              <span>ig</span>
              <span>in</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 py-4 text-center text-sm text-neutral-500">(C) Copyright Rimel 2022. All right reserved</div>
      </footer>
    </div>
  )
}
