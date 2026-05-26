import {
  ArrowLeft,
  Bell,
  LayoutDashboard,
  MessageSquare,
  Package,
  Search,
  ShoppingCart,
  Tags,
  User,
} from 'lucide-react'
import type { JSX } from 'react'
import logotipe from '../assets/logotipe.png'
import type { AdminUser } from '../types'

type Screen = 'dashboard' | 'orders' | 'products' | 'productForm' | 'categories' | 'brands' | 'users'

export function AdminLayout({
  children,
  screen,
  user,
  orderCount,
  userCount,
  search,
  onSearch,
  onScreen,
  onLogout,
}: {
  children: JSX.Element
  screen: Screen
  user: AdminUser
  orderCount: number
  userCount: number
  search: string
  onSearch: (value: string) => void
  onScreen: (screen: Screen) => void
  onLogout: () => void
}) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <button type="button" className="admin-logo" onClick={() => onScreen('dashboard')}>
          <img src={logotipe} alt="fastcart" />
          <span>fastcart</span>
        </button>

        <nav className="admin-side-nav" aria-label="Admin navigation">
          <button type="button" className={screen === 'dashboard' ? 'active' : ''} onClick={() => onScreen('dashboard')}>
            <LayoutDashboard size={19} />
            Dashboard
          </button>
          <button type="button" className={screen === 'orders' ? 'active' : ''} onClick={() => onScreen('orders')}>
            <ShoppingCart size={19} />
            Orders
            <b>{orderCount}</b>
          </button>
          <button type="button" className={screen === 'products' || screen === 'productForm' ? 'active' : ''} onClick={() => onScreen('products')}>
            <Package size={19} />
            Products
          </button>
          <button type="button" className={screen === 'categories' || screen === 'brands' ? 'active' : ''} onClick={() => onScreen('categories')}>
            <Tags size={19} />
            Other
          </button>
          <button type="button" className={screen === 'users' ? 'active' : ''} onClick={() => onScreen('users')}>
            <User size={19} />
            Users
            <b>{userCount}</b>
          </button>
        </nav>

        <button type="button" className="admin-back-store" onClick={onLogout}>
          <ArrowLeft size={19} />
          Log out
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <label className="admin-top-search">
            <Search size={18} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search..." />
          </label>
          <button type="button" className="admin-circle-button">
            <MessageSquare size={18} />
          </button>
          <button type="button" className="admin-circle-button">
            <Bell size={18} />
            <span>5</span>
          </button>
          <button type="button" className="admin-profile">
            <span>{user.name.slice(0, 1).toUpperCase()}</span>
            <strong>{user.name}</strong>
          </button>
        </header>

        <div className="admin-content">{children}</div>
      </section>
    </main>
  )
}
