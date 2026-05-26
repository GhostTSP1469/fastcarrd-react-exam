import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const HomePage = lazy(() => import('./pages/HomePage').then((page) => ({ default: page.HomePage })))
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((page) => ({ default: page.ProductsPage })))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage').then((page) => ({ default: page.ProductDetailsPage })))
const WishlistPage = lazy(() => import('./pages/WishlistPage').then((page) => ({ default: page.WishlistPage })))
const CartPage = lazy(() => import('./pages/CartPage').then((page) => ({ default: page.CartPage })))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((page) => ({ default: page.CheckoutPage })))
const AccountProfilePage = lazy(() => import('./pages/AccountProfilePage').then((page) => ({ default: page.AccountProfilePage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((page) => ({ default: page.LoginPage })))
const SignUpPage = lazy(() => import('./pages/SignUpPage').then((page) => ({ default: page.SignUpPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((page) => ({ default: page.AboutPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((page) => ({ default: page.ContactPage })))
const AdminPage = lazy(() => import('./pages/admin/AdminPage').then((page) => ({ default: page.AdminPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((page) => ({ default: page.NotFoundPage })))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="grid min-h-screen place-items-center bg-white font-bold text-[#111] dark:bg-[#111] dark:text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
