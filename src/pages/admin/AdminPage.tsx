import {
  ArrowLeft,
  Bell,
  ChevronLeft,
  ChevronRight,
  Image,
  Layers,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteBrand, getBrands, updateBrand, addBrand, type Brand } from '../../api/brandApi'
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
} from '../../api/categoryApi'
import { addColor, getColors, type Color } from '../../api/colorApi'
import { getApiErrorMessage } from '../../api/getApiErrorMessage'
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type Product,
} from '../../api/productApi'
import {
  addSubCategory,
  getSubCategories,
  type SubCategoryItem,
} from '../../api/subCategoryApi'
import {
  addRoleToUser,
  deleteUser,
  getUserProfiles,
  getUserRoles,
  removeRoleFromUser,
  type UserProfile,
  type UserRole,
} from '../../api/userProfileApi'
import logotipe from '../../assets/logotipe.png'
import { LogoutButton } from '../../components/common/LogoutButton'
import { StoreLayout } from '../../components/layout/StoreLayout'
import { logout } from '../../store/authSlice'
import { fetchCatalog } from '../../store/catalogSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { isAdminUser } from '../../utils/authUser'
import { getColorValue } from '../../utils/colors'
import { getImageUrl } from '../../utils/images'
import { ProductImageUpload } from './components/ProductImageUpload'

type FormSubmit = {
  preventDefault: () => void
}

type AdminScreen =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'productForm'
  | 'categories'
  | 'brands'
  | 'banners'
  | 'users'

type ProductForm = {
  id: string
  productName: string
  code: string
  description: string
  price: string
  discountPrice: string
  hasDiscount: boolean
  quantity: string
  weight: string
  size: string
  brandId: string
  colorId: string
  categoryId: string
  subCategoryId: string
  images: FileList | null
}

type AdminOrder = {
  id: number
  date: string
  customer: string
  paymentStatus: 'Paid' | 'Pending'
  orderStatus: 'Ready' | 'Shipped' | 'Received'
  total: number
}

type BannerItem = {
  id: number
  title: string
  subtitle: string
  productId: number | null
  active: boolean
}

type ChartHoverPoint = {
  x: number
  y: number
  month: string
  value: number
}

type ConfirmState = {
  title: string
  description: string
  action: () => Promise<void>
}

const emptyProductForm: ProductForm = {
  id: '',
  productName: '',
  code: '',
  description: '',
  price: '',
  discountPrice: '',
  hasDiscount: false,
  quantity: '',
  weight: '',
  size: '',
  brandId: '',
  colorId: '',
  categoryId: '',
  subCategoryId: '',
  images: null,
}

const defaultOrders: AdminOrder[] = [
  {
    id: 12512,
    date: '2026-05-21',
    customer: 'Reptile',
    paymentStatus: 'Paid',
    orderStatus: 'Ready',
    total: 125,
  },
  {
    id: 12511,
    date: '2026-05-20',
    customer: 'Said',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    total: 89,
  },
  {
    id: 12510,
    date: '2026-05-19',
    customer: 'Saida',
    paymentStatus: 'Pending',
    orderStatus: 'Received',
    total: 240,
  },
  {
    id: 12509,
    date: '2026-05-18',
    customer: 'user8',
    paymentStatus: 'Paid',
    orderStatus: 'Ready',
    total: 42,
  },
]

const defaultBanners: BannerItem[] = [
  {
    id: 1,
    title: 'iPhone 14 Series',
    subtitle: 'Up to 10% off Voucher',
    productId: null,
    active: true,
  },
  {
    id: 2,
    title: 'New products',
    subtitle: 'Fresh arrivals for the home page',
    productId: null,
    active: true,
  },
]

const chartPoints = [
  { x: 48, y: 218, month: 'Jan' },
  { x: 95, y: 164, month: 'Feb' },
  { x: 142, y: 175, month: 'Mar' },
  { x: 189, y: 118, month: 'Apr' },
  { x: 236, y: 132, month: 'May' },
  { x: 283, y: 76, month: 'Jun' },
  { x: 330, y: 96, month: 'Jul' },
  { x: 377, y: 62, month: 'Aug' },
  { x: 424, y: 86, month: 'Sep' },
  { x: 471, y: 56, month: 'Oct' },
  { x: 518, y: 74, month: 'Nov' },
  { x: 574, y: 44, month: 'Dec' },
]

function getChartPoint(cursorX: number): ChartHoverPoint {
  const first = chartPoints[0]
  const last = chartPoints[chartPoints.length - 1]
  const x = Math.max(first.x, Math.min(last.x, cursorX))
  const nextIndex = chartPoints.findIndex((point) => point.x >= x)

  if (nextIndex <= 0) {
    return {
      ...first,
      value: Math.round((240 - first.y) * 780),
    }
  }

  const left = chartPoints[nextIndex - 1]
  const right = chartPoints[nextIndex]
  const progress = (x - left.x) / (right.x - left.x)
  const y = left.y + (right.y - left.y) * progress

  return {
    x,
    y,
    month: right.month,
    value: Math.round((240 - y) * 780),
  }
}

function asNumber(value: string) {
  return value ? Number(value) : undefined
}

function money(value: number | string | undefined | null) {
  return `$${Number(value ?? 0).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`
}

function getStockLabel(quantity?: number | null) {
  if (!quantity || quantity < 1) {
    return 'Out of stock'
  }

  if (quantity < 20) {
    return 'Low stock'
  }

  return `${quantity} in stock`
}

function makeOrders(products: Product[], users: UserProfile[]) {
  if (!products.length) {
    return defaultOrders
  }

  return products.slice(0, 5).map((product, index) => ({
    id: 12600 - index,
    date: `2026-05-${String(21 - index).padStart(2, '0')}`,
    customer: users[index]?.userName ?? defaultOrders[index % defaultOrders.length].customer,
    paymentStatus: index % 3 === 0 ? 'Pending' : 'Paid',
    orderStatus: index % 3 === 0 ? 'Ready' : index % 3 === 1 ? 'Shipped' : 'Received',
    total: product.hasDiscount && product.discountPrice ? product.discountPrice : product.price,
  })) as AdminOrder[]
}

export function AdminPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const adminUser = isAdminUser(user)
  const [screen, setScreen] = useState<AdminScreen>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [roles, setRoles] = useState<UserRole[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>(defaultOrders)
  const [banners, setBanners] = useState<BannerItem[]>(defaultBanners)
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm)
  const [brandName, setBrandName] = useState('')
  const [brandEditId, setBrandEditId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryEditId, setCategoryEditId] = useState('')
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [bannerTitle, setBannerTitle] = useState('')
  const [bannerSubtitle, setBannerSubtitle] = useState('')
  const [newColorName, setNewColorName] = useState('')
  const [newSubCategoryName, setNewSubCategoryName] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [productSort, setProductSort] = useState('newest')
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([])
  const [productPage, setProductPage] = useState(1)
  const [orderPage, setOrderPage] = useState(1)
  const [userPage, setUserPage] = useState(1)
  const [message, setMessage] = useState('Loading admin data...')
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const productSearchText = productSearch.toLowerCase().trim()
  const orderSearchText = orderSearch.toLowerCase().trim()
  const categorySearchText = categorySearch.toLowerCase().trim()
  const userSearchText = userSearch.toLowerCase().trim()

  const searchedProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(productSearchText),
  )
  let filteredProducts = [...searchedProducts].sort((left, right) => right.id - left.id)

  if (productSort === 'price') {
    filteredProducts = [...searchedProducts].sort((left, right) => left.price - right.price)
  }

  if (productSort === 'oldest') {
    filteredProducts = [...searchedProducts].sort((left, right) => left.id - right.id)
  }

  const filteredOrders = orders.filter((order) => {
    return (
      String(order.id).includes(orderSearchText) ||
      order.customer.toLowerCase().includes(orderSearchText) ||
      order.orderStatus.toLowerCase().includes(orderSearchText)
    )
  })

  const visibleCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(categorySearchText),
  )

  const filteredUsers = users.filter((item) => {
    const rolesText = item.userRoles.map((role) => role.name).join(' ').toLowerCase()

    return (
      item.userName.toLowerCase().includes(userSearchText) ||
      item.email.toLowerCase().includes(userSearchText) ||
      rolesText.includes(userSearchText)
    )
  })

  const topProducts = [...products]
    .sort((left, right) => (right.quantity ?? 0) - (left.quantity ?? 0))
    .slice(0, 5)

  const productPages = Math.max(1, Math.ceil(filteredProducts.length / 6))
  const orderPages = Math.max(1, Math.ceil(filteredOrders.length / 6))
  const userPages = Math.max(1, Math.ceil(filteredUsers.length / 6))
  const visibleProducts = filteredProducts.slice((productPage - 1) * 6, productPage * 6)
  const visibleOrders = filteredOrders.slice((orderPage - 1) * 6, orderPage * 6)
  const visibleUsers = filteredUsers.slice((userPage - 1) * 6, userPage * 6)
  const activeOther = screen === 'categories' || screen === 'brands' || screen === 'banners'
  const topSearchValue = screen === 'orders' ? orderSearch : screen === 'users' ? userSearch : productSearch
  const salesTotal = products.reduce((sum, product) => sum + product.price * (product.quantity ?? 1), 0)
  const costTotal = Math.round(salesTotal * 0.62)
  const profitTotal = Math.max(0, salesTotal - costTotal)

  async function refreshAdmin() {
    setLoading(true)
    try {
      const [productsResult, brandsResult, categoriesResult, colorsResult, usersResult, rolesResult] =
        await Promise.all([
          getProducts({ PageNumber: 1, PageSize: 100 }),
          getBrands({ PageNumber: 1, PageSize: 100 }),
          getCategories(),
          getColors(),
          getUserProfiles({ PageNumber: 1, PageSize: 100 }),
          getUserRoles(),
        ])

      const nextProducts = productsResult.data?.products ?? []
      const nextUsers = usersResult.data?.userProfiles ?? []

      setProducts(nextProducts)
      setBrands(brandsResult.data?.brands ?? [])
      setCategories(categoriesResult.data ?? [])
      setColors(colorsResult.data ?? [])
      setUsers(nextUsers)
      setRoles(rolesResult.data ?? [])
      setOrders(makeOrders(nextProducts, nextUsers))
      setMessage('Admin data refreshed')
      void dispatch(fetchCatalog())
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!adminUser) {
      return
    }

    let active = true

    Promise.all([
      getProducts({ PageNumber: 1, PageSize: 100 }),
      getBrands({ PageNumber: 1, PageSize: 100 }),
      getCategories(),
      getColors(),
      getUserProfiles({ PageNumber: 1, PageSize: 100 }),
      getUserRoles(),
    ])
      .then(([productsResult, brandsResult, categoriesResult, colorsResult, usersResult, rolesResult]) => {
        if (!active) {
          return
        }

        const nextProducts = productsResult.data?.products ?? []
        const nextUsers = usersResult.data?.userProfiles ?? []

        setProducts(nextProducts)
        setBrands(brandsResult.data?.brands ?? [])
        setCategories(categoriesResult.data ?? [])
        setColors(colorsResult.data ?? [])
        setUsers(nextUsers)
        setRoles(rolesResult.data ?? [])
        setOrders(makeOrders(nextProducts, nextUsers))
        setMessage('Admin data loaded')
        void dispatch(fetchCatalog())
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(getApiErrorMessage(error))
        }
      })

    return () => {
      active = false
    }
  }, [adminUser, dispatch])

  function changeProductField(key: string, value: string | boolean | FileList | null) {
    setProductForm((form) => ({ ...form, [key]: value }))
  }

  async function loadSubCategories(categoryId: string) {
    if (!categoryId) {
      setSubCategories([])
      return
    }

    try {
      const response = await getSubCategories(Number(categoryId))
      setSubCategories(response.data ?? [])
    } catch (error) {
      setSubCategories([])
      setMessage(getApiErrorMessage(error))
    }
  }

  function openProductForm(product?: Product) {
    if (!product) {
      setProductForm(emptyProductForm)
      setSubCategories([])
      setScreen('productForm')
      return
    }

    const categoryId = product.categoryId ? String(product.categoryId) : ''

    setProductForm({
      id: String(product.id),
      productName: product.productName,
      code: product.code ?? '',
      description: product.description ?? '',
      price: String(product.price),
      discountPrice: String(product.discountPrice ?? ''),
      hasDiscount: Boolean(product.hasDiscount),
      quantity: String(product.quantity ?? ''),
      weight: product.weight ?? '',
      size: product.size ?? '',
      brandId: String(product.brandId ?? ''),
      colorId: String(product.colorId ?? ''),
      categoryId,
      subCategoryId: String(product.subCategoryId ?? ''),
      images: null,
    })

    void loadSubCategories(categoryId)
    setScreen('productForm')
  }

  function askDelete(title: string, description: string, action: () => Promise<void>) {
    setConfirm({ title, description, action })
  }

  async function runConfirmAction() {
    if (!confirm) {
      return
    }

    setLoading(true)
    try {
      await confirm.action()
      setConfirm(null)
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function saveProduct(event: FormSubmit) {
    event.preventDefault()
    setLoading(true)

    try {
      const readySubCategoryId = await getReadySubCategoryId()

      if (productForm.id) {
        await updateProduct({
          Id: Number(productForm.id),
          ProductName: productForm.productName,
          Description: productForm.description || undefined,
          Price: Number(productForm.price),
          Quantity: asNumber(productForm.quantity),
          BrandId: asNumber(productForm.brandId),
          ColorId: asNumber(productForm.colorId),
          SubCategoryId: readySubCategoryId,
          Code: productForm.code || undefined,
          Weight: productForm.weight || undefined,
          Size: productForm.size || undefined,
          HasDiscount: productForm.hasDiscount,
          DiscountPrice: asNumber(productForm.discountPrice),
        })
      } else {
        const formData = new FormData()
        formData.append('ProductName', productForm.productName)
        formData.append('Price', productForm.price)
        formData.append('HasDiscount', String(productForm.hasDiscount))
        if (productForm.code) formData.append('Code', productForm.code)
        if (productForm.description) formData.append('Description', productForm.description)
        if (productForm.discountPrice) formData.append('DiscountPrice', productForm.discountPrice)
        if (productForm.quantity) formData.append('Quantity', productForm.quantity)
        if (productForm.weight) formData.append('Weight', productForm.weight)
        if (productForm.size) formData.append('Size', productForm.size)
        if (productForm.brandId) formData.append('BrandId', productForm.brandId)
        if (productForm.colorId) formData.append('ColorId', productForm.colorId)
        if (readySubCategoryId) formData.append('SubCategoryId', String(readySubCategoryId))
        Array.from(productForm.images ?? []).forEach((file) => {
          formData.append('Images', file)
        })
        await addProduct(formData)
      }

      setMessage(productForm.id ? 'Product updated' : 'Product created')
      setProductForm(emptyProductForm)
      setScreen('products')
      await refreshAdmin()
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function saveBrand(event: FormSubmit) {
    event.preventDefault()
    setLoading(true)

    try {
      if (brandEditId) {
        await updateBrand(Number(brandEditId), brandName)
      } else {
        await addBrand(brandName)
      }

      setBrandName('')
      setBrandEditId('')
      setMessage(brandEditId ? 'Brand updated' : 'Brand created')
      await refreshAdmin()
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function saveCategory(event: FormSubmit) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData()

    if (categoryEditId) {
      formData.append('Id', categoryEditId)
    }
    formData.append('CategoryName', categoryName)
    if (categoryImage) {
      formData.append('CategoryImage', categoryImage)
    }

    try {
      if (categoryEditId) {
        await updateCategory(formData)
      } else {
        await addCategory(formData)
      }

      setCategoryName('')
      setCategoryEditId('')
      setCategoryImage(null)
      setMessage(categoryEditId ? 'Category updated' : 'Category created')
      await refreshAdmin()
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function createColor() {
    if (!newColorName.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await addColor(newColorName)
      setNewColorName('')
      if (response.data) {
        changeProductField('colorId', String(response.data.id))
      }
      await refreshAdmin()
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function createSubCategory() {
    if (!productForm.categoryId || !newSubCategoryName.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await addSubCategory(Number(productForm.categoryId), newSubCategoryName)
      setNewSubCategoryName('')
      if (response.data) {
        changeProductField('subCategoryId', String(response.data.id))
      }
      await loadSubCategories(productForm.categoryId)
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function getReadySubCategoryId() {
    if (productForm.subCategoryId) {
      return Number(productForm.subCategoryId)
    }

    if (!productForm.categoryId) {
      return undefined
    }

    const categoryId = Number(productForm.categoryId)
    const response = await getSubCategories(categoryId)
    const list = response.data ?? []
    const general = list.find((item) => item.subCategoryName.toLowerCase() === 'general')
    const readySubCategory = general ?? list[0]

    if (readySubCategory) {
      return readySubCategory.id
    }

    const created = await addSubCategory(categoryId, 'General')

    return created.data?.id
  }

  function toggleProduct(id: number) {
    setSelectedProductIds((items) => {
      if (items.includes(id)) {
        return items.filter((item) => item !== id)
      }

      return [...items, id]
    })
  }

  function toggleOrder(id: number) {
    setSelectedOrderIds((items) => {
      if (items.includes(id)) {
        return items.filter((item) => item !== id)
      }

      return [...items, id]
    })
  }

  async function removeSelectedProducts() {
    const ids = [...selectedProductIds]
    await Promise.all(ids.map((id) => deleteProduct(id)))
    setSelectedProductIds([])
    await refreshAdmin()
  }

  function removeSelectedOrders() {
    setOrders((items) => items.filter((order) => !selectedOrderIds.includes(order.id)))
    setSelectedOrderIds([])
    setMessage('Selected orders removed')
  }

  function addLocalOrder() {
    const nextProduct = products[0]
    const nextUser = users[0]

    setOrders((items) => [
      {
        id: Math.max(...items.map((order) => order.id), 12000) + 1,
        date: '2026-05-23',
        customer: nextUser?.userName ?? 'New customer',
        paymentStatus: 'Pending',
        orderStatus: 'Ready',
        total: nextProduct?.price ?? 0,
      },
      ...items,
    ])
    setScreen('orders')
    setMessage('Order added locally')
  }

  function toggleOrderStatus(id: number) {
    setOrders((items) =>
      items.map((order) => {
        if (order.id !== id) {
          return order
        }

        const nextStatus = order.orderStatus === 'Ready' ? 'Shipped' : order.orderStatus === 'Shipped' ? 'Received' : 'Ready'

        return { ...order, orderStatus: nextStatus }
      }),
    )
  }

  async function addRole(userId: number, roleId: string) {
    if (!roleId) {
      return
    }

    setLoading(true)
    try {
      await addRoleToUser(userId, Number(roleId))
      setMessage('Role added')
      await refreshAdmin()
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function removeRole(userId: number, roleId: number) {
    setLoading(true)
    try {
      await removeRoleFromUser(userId, roleId)
      setMessage('Role removed')
      await refreshAdmin()
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  function saveBanner(event: FormSubmit) {
    event.preventDefault()

    setBanners((items) => [
      ...items,
      {
        id: Math.max(...items.map((banner) => banner.id), 0) + 1,
        title: bannerTitle,
        subtitle: bannerSubtitle,
        productId: products[0]?.id ?? null,
        active: true,
      },
    ])
    setBannerTitle('')
    setBannerSubtitle('')
    setMessage('Banner saved locally')
  }

  function signOut() {
    dispatch(logout())
    navigate('/')
  }

  if (!adminUser) {
    return (
      <StoreLayout>
        <main className="locked-profile container">
          <h1>Admin panel</h1>
          <p>Only users with Admin or SuperAdmin role can open this page.</p>
        </main>
      </StoreLayout>
    )
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <button type="button" className="admin-logo" onClick={() => setScreen('dashboard')}>
          <img src={logotipe} alt="fastcart" />
          <span>fastcart</span>
        </button>

        <nav className="admin-side-nav" aria-label="Admin navigation">
          <button
            type="button"
            className={`admin-nav-item ${screen === 'dashboard' ? 'active' : ''}`}
            onClick={() => setScreen('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            type="button"
            className={`admin-nav-item ${screen === 'orders' ? 'active' : ''}`}
            onClick={() => setScreen('orders')}
          >
            <ShoppingCart size={18} />
            Orders
            <span>{orders.length}</span>
          </button>
          <button
            type="button"
            className={`admin-nav-item ${screen === 'products' || screen === 'productForm' ? 'active' : ''}`}
            onClick={() => setScreen('products')}
          >
            <Package size={18} />
            Products
          </button>
          <button
            type="button"
            className={`admin-nav-item ${activeOther ? 'active' : ''}`}
            onClick={() => setScreen('categories')}
          >
            <Layers size={18} />
            Other
          </button>
          <button
            type="button"
            className={`admin-nav-item ${screen === 'users' ? 'active' : ''}`}
            onClick={() => setScreen('users')}
          >
            <User size={18} />
            Users
            <span>{users.length}</span>
          </button>
        </nav>

        <button type="button" className="admin-nav-item admin-nav-bottom" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Store
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <label className="admin-top-search">
            <Search size={18} />
            <input
              value={topSearchValue}
              onChange={(event) => {
                if (screen === 'orders') {
                  setOrderSearch(event.target.value)
                } else if (screen === 'users') {
                  setUserSearch(event.target.value)
                } else {
                  setProductSearch(event.target.value)
                }
              }}
              placeholder="Search"
            />
          </label>
          <button type="button" className="admin-circle-button" aria-label="Messages">
            <MessageSquare size={18} />
          </button>
          <button type="button" className="admin-circle-button" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button type="button" className="admin-profile-button" onClick={() => navigate('/account')}>
            <span>{user?.name?.slice(0, 1).toUpperCase() ?? 'A'}</span>
            <div>
              <b>{user?.name ?? 'Admin'}</b>
              <small>{user?.roles.join(', ')}</small>
            </div>
          </button>
          <LogoutButton text="Logout" onClick={signOut} />
        </header>

        <div className="admin-content">
          <div className="admin-status-row">
            <span>{message}{roles.length ? ` · ${roles.length} roles loaded` : ''}</span>
            <button type="button" className="admin-refresh" disabled={loading} onClick={refreshAdmin}>
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          {screen === 'dashboard' ? (
            <DashboardScreen
              salesTotal={salesTotal}
              costTotal={costTotal}
              profitTotal={profitTotal}
              products={products}
              topProducts={topProducts}
              orders={orders}
            />
          ) : null}

          {screen === 'products' ? (
            <ProductsScreen
              products={visibleProducts}
              page={productPage}
              totalPages={productPages}
              totalResults={filteredProducts.length}
              search={productSearch}
              sort={productSort}
              selectedIds={selectedProductIds}
              onSearch={setProductSearch}
              onSort={setProductSort}
              onPage={setProductPage}
              onAdd={() => openProductForm()}
              onEdit={openProductForm}
              onToggle={toggleProduct}
              onDelete={(product) =>
                askDelete('Delete product', `Delete ${product.productName}?`, async () => {
                  await deleteProduct(product.id)
                  await refreshAdmin()
                })
              }
              onDeleteSelected={() =>
                askDelete('Delete selected products', 'Selected products will be removed from the API.', removeSelectedProducts)
              }
            />
          ) : null}

          {screen === 'productForm' ? (
            <ProductFormScreen
              form={productForm}
              brands={brands}
              categories={categories}
              colors={colors}
              subCategories={subCategories}
              newColorName={newColorName}
              newSubCategoryName={newSubCategoryName}
              loading={loading}
              onBack={() => setScreen('products')}
              onChange={changeProductField}
              onCategoryChange={(value) => {
                changeProductField('categoryId', value)
                changeProductField('subCategoryId', '')
                void loadSubCategories(value)
              }}
              onNewColorName={setNewColorName}
              onCreateColor={() => void createColor()}
              onNewSubCategoryName={setNewSubCategoryName}
              onCreateSubCategory={() => void createSubCategory()}
              onSubmit={saveProduct}
            />
          ) : null}

          {screen === 'orders' ? (
            <OrdersScreen
              orders={visibleOrders}
              page={orderPage}
              totalPages={orderPages}
              totalResults={filteredOrders.length}
              search={orderSearch}
              selectedIds={selectedOrderIds}
              onSearch={setOrderSearch}
              onPage={setOrderPage}
              onAdd={addLocalOrder}
              onToggle={toggleOrder}
              onStatus={toggleOrderStatus}
              onDelete={(order) =>
                askDelete('Delete order', `Delete order #${order.id}?`, async () => {
                  setOrders((items) => items.filter((item) => item.id !== order.id))
                })
              }
              onDeleteSelected={() =>
                askDelete('Delete selected orders', 'Selected orders will be removed from this dashboard.', async () => {
                  removeSelectedOrders()
                })
              }
            />
          ) : null}

          {screen === 'users' ? (
            <UsersScreen
              users={visibleUsers}
              roles={roles}
              search={userSearch}
              page={userPage}
              totalPages={userPages}
              totalResults={filteredUsers.length}
              currentUserId={user?.id ?? ''}
              onSearch={setUserSearch}
              onPage={setUserPage}
              onAddRole={(userId, roleId) => void addRole(userId, roleId)}
              onRemoveRole={(userId, roleId) => void removeRole(userId, roleId)}
              onDelete={(profile) =>
                askDelete('Delete user', `Delete ${profile.userName}?`, async () => {
                  await deleteUser(profile.userId)
                  await refreshAdmin()
                })
              }
            />
          ) : null}

          {screen === 'categories' ? (
            <CategoriesScreen
              categories={visibleCategories}
              search={categorySearch}
              categoryName={categoryName}
              categoryEditId={categoryEditId}
              onSearch={setCategorySearch}
              onName={setCategoryName}
              onFile={setCategoryImage}
              onSubmit={saveCategory}
              onAdd={() => {
                setCategoryName('')
                setCategoryEditId('')
                setCategoryImage(null)
              }}
              onEdit={(category) => {
                setCategoryEditId(String(category.id))
                setCategoryName(category.categoryName)
                setCategoryImage(null)
              }}
              onDelete={(category) =>
                askDelete('Delete category', `Delete ${category.categoryName}?`, async () => {
                  await deleteCategory(category.id)
                  await refreshAdmin()
                })
              }
              onOpenBrands={() => setScreen('brands')}
              onOpenBanners={() => setScreen('banners')}
            />
          ) : null}

          {screen === 'brands' ? (
            <BrandsScreen
              brands={brands}
              brandName={brandName}
              brandEditId={brandEditId}
              onName={setBrandName}
              onSubmit={saveBrand}
              onEdit={(brand) => {
                setBrandEditId(String(brand.id))
                setBrandName(brand.brandName)
              }}
              onDelete={(brand) =>
                askDelete('Delete brand', `Delete ${brand.brandName}?`, async () => {
                  await deleteBrand(brand.id)
                  await refreshAdmin()
                })
              }
              onOpenCategories={() => setScreen('categories')}
              onOpenBanners={() => setScreen('banners')}
            />
          ) : null}

          {screen === 'banners' ? (
            <BannersScreen
              banners={banners}
              products={products}
              title={bannerTitle}
              subtitle={bannerSubtitle}
              onTitle={setBannerTitle}
              onSubtitle={setBannerSubtitle}
              onSubmit={saveBanner}
              onToggle={(id) =>
                setBanners((items) =>
                  items.map((banner) => (banner.id === id ? { ...banner, active: !banner.active } : banner)),
                )
              }
              onDelete={(id) => setBanners((items) => items.filter((banner) => banner.id !== id))}
              onOpenCategories={() => setScreen('categories')}
              onOpenBrands={() => setScreen('brands')}
            />
          ) : null}
        </div>
      </section>

      {confirm ? (
        <div className="admin-modal-backdrop">
          <section className="admin-modal">
            <div className="admin-modal-icon">
              <Trash2 size={22} />
            </div>
            <h2>{confirm.title}</h2>
            <p>{confirm.description}</p>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setConfirm(null)}>
                Cancel
              </button>
              <button type="button" className="admin-danger-button" onClick={() => void runConfirmAction()}>
                Delete
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}

function DashboardScreen({
  salesTotal,
  costTotal,
  profitTotal,
  products,
  topProducts,
  orders,
}: {
  salesTotal: number
  costTotal: number
  profitTotal: number
  products: Product[]
  topProducts: Product[]
  orders: AdminOrder[]
}) {
  const [chartHover, setChartHover] = useState<ChartHoverPoint | null>(null)
  const chartLine = chartPoints.map((point) => `${point.x},${point.y}`).join(' ')

  function moveChart(event: { currentTarget: SVGSVGElement; clientX: number }) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 620

    setChartHover(getChartPoint(x))
  }

  return (
    <>
      <div className="admin-page-title">
        <h1>Dashboard</h1>
      </div>

      <section className="admin-stat-row">
        <article className="admin-stat-card yellow">
          <span>Sales</span>
          <strong>{money(salesTotal || 152000)}</strong>
          <small>+12% from last week</small>
        </article>
        <article className="admin-stat-card red">
          <span>Cost</span>
          <strong>{money(costTotal || 99700)}</strong>
          <small>Products and shipping</small>
        </article>
        <article className="admin-stat-card green">
          <span>Profit</span>
          <strong>{money(profitTotal || 32100)}</strong>
          <small>Manual dashboard chart</small>
        </article>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-card admin-chart-card-new">
          <div className="admin-card-title">
            <div>
              <h2>Sales Revenue</h2>
              <p>Last 12 months</p>
            </div>
            <button type="button">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <svg
            viewBox="0 0 620 280"
            role="img"
            aria-label="Sales revenue chart"
            onMouseMove={moveChart}
            onMouseLeave={() => setChartHover(null)}
          >
            <line x1="40" y1="240" x2="590" y2="240" />
            <line x1="40" y1="188" x2="590" y2="188" />
            <line x1="40" y1="136" x2="590" y2="136" />
            <line x1="40" y1="84" x2="590" y2="84" />
            <polyline points={chartLine} />
            <rect className="admin-chart-hit-area" x="38" y="22" width="556" height="224" />
            {chartHover ? (
              <>
                <line className="admin-chart-hover-line" x1={chartHover.x} y1="40" x2={chartHover.x} y2="240" />
                <circle className="admin-chart-hover-dot" cx={chartHover.x} cy={chartHover.y} r="8" />
                <g
                  className="admin-chart-tooltip"
                  transform={`translate(${Math.min(chartHover.x + 14, 500)} ${Math.max(chartHover.y - 58, 28)})`}
                >
                  <rect width="104" height="48" rx="9" />
                  <text x="12" y="20">{chartHover.month}</text>
                  <text x="12" y="37">{money(chartHover.value)}</text>
                </g>
              </>
            ) : null}
            <text x="46" y="266">Jan</text>
            <text x="184" y="266">Apr</text>
            <text x="326" y="266">Jul</text>
            <text x="468" y="266">Oct</text>
            <text x="560" y="266">Dec</text>
          </svg>
        </article>

        <article className="admin-card admin-selling-card">
          <div className="admin-card-title">
            <div>
              <h2>Top selling products</h2>
              <p>{products.length} products in catalog</p>
            </div>
          </div>
          <div className="admin-selling-list">
            {topProducts.map((product) => (
              <div key={product.id}>
                <img src={getImageUrl(product.image)} alt={product.productName} />
                <span>
                  <b>{product.productName}</b>
                  <small>{product.categoryName ?? 'Product'}</small>
                </span>
                <strong>{money(product.hasDiscount ? product.discountPrice : product.price)}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-bottom-grid">
        <article className="admin-card">
          <div className="admin-card-title">
            <h2>Recent Transactions</h2>
          </div>
          <table className="admin-data-table compact">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>
                    <span className={`admin-status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                  </td>
                  <td>{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="admin-card">
          <div className="admin-card-title">
            <h2>Top Products by Units Sold</h2>
          </div>
          <table className="admin-data-table compact">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.productName}</td>
                  <td>{product.quantity ?? 0}</td>
                  <td>{money(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </>
  )
}

function ProductsScreen({
  products,
  page,
  totalPages,
  totalResults,
  search,
  sort,
  selectedIds,
  onSearch,
  onSort,
  onPage,
  onAdd,
  onEdit,
  onToggle,
  onDelete,
  onDeleteSelected,
}: {
  products: Product[]
  page: number
  totalPages: number
  totalResults: number
  search: string
  sort: string
  selectedIds: number[]
  onSearch: (value: string) => void
  onSort: (value: string) => void
  onPage: (page: number) => void
  onAdd: () => void
  onEdit: (product: Product) => void
  onToggle: (id: number) => void
  onDelete: (product: Product) => void
  onDeleteSelected: () => void
}) {
  return (
    <>
      <div className="admin-page-title">
        <h1>Products</h1>
        <button type="button" className="admin-blue-button" onClick={onAdd}>
          <Plus size={18} />
          Add product
        </button>
      </div>

      <section className="admin-card">
        <div className="admin-table-toolbar">
          <label className="admin-search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search product" />
          </label>
          <select value={sort} onChange={(event) => onSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price">Price</option>
          </select>
          <button type="button" className="admin-icon-button" aria-label="Edit selected">
            <Pencil size={17} />
          </button>
          <button type="button" className="admin-icon-button danger" onClick={onDeleteSelected} disabled={!selectedIds.length}>
            <Trash2 size={17} />
          </button>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th aria-label="Select products"></th>
              <th>Product</th>
              <th>Inventory</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <label className="relative inline-flex w-[22px] cursor-pointer justify-center">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => onToggle(product.id)}
                    />
                    <span className="flex h-5 w-5 rounded-md border border-[#a2a1a833] bg-[#e8e8e8] transition peer-checked:bg-[#7152f3] peer-checked:[&>svg]:stroke-white peer-checked:[&>svg]:opacity-100">
                      <svg className="h-5 w-5 stroke-[#e8e8e8] opacity-0" fill="none" viewBox="0 0 24 24">
                        <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </label>
                </td>
                <td>
                  <div className="admin-product-info">
                    <img src={getImageUrl(product.image)} alt={product.productName} />
                    <span>
                      <b>{product.productName}</b>
                      <small>{product.code ?? `#${product.id}`}</small>
                    </span>
                  </div>
                </td>
                <td>{getStockLabel(product.quantity)}</td>
                <td>{product.categoryName ?? 'No category'}</td>
                <td>{money(product.hasDiscount ? product.discountPrice : product.price)}</td>
                <td>
                  <div className="admin-row-actions">
                    <button type="button" className="edit" onClick={() => onEdit(product)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="delete" onClick={() => onDelete(product)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <AdminPagination page={page} totalPages={totalPages} totalResults={totalResults} onPage={onPage} />
      </section>
    </>
  )
}

function OrdersScreen({
  orders,
  page,
  totalPages,
  totalResults,
  search,
  selectedIds,
  onSearch,
  onPage,
  onAdd,
  onToggle,
  onStatus,
  onDelete,
  onDeleteSelected,
}: {
  orders: AdminOrder[]
  page: number
  totalPages: number
  totalResults: number
  search: string
  selectedIds: number[]
  onSearch: (value: string) => void
  onPage: (page: number) => void
  onAdd: () => void
  onToggle: (id: number) => void
  onStatus: (id: number) => void
  onDelete: (order: AdminOrder) => void
  onDeleteSelected: () => void
}) {
  return (
    <>
      <div className="admin-page-title">
        <h1>Orders</h1>
        <button type="button" className="admin-blue-button" onClick={onAdd}>
          <Plus size={18} />
          Add order
        </button>
      </div>

      <section className="admin-card">
        <div className="admin-table-toolbar">
          <label className="admin-search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search order" />
          </label>
          <select defaultValue="newest">
            <option value="newest">Newest</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <button type="button" className="admin-icon-button">
            <Pencil size={17} />
          </button>
          <button type="button" className="admin-icon-button danger" onClick={onDeleteSelected} disabled={!selectedIds.length}>
            <Trash2 size={17} />
          </button>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th aria-label="Select orders"></th>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Payment status</th>
              <th>Order Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <label className="relative inline-flex w-[22px] cursor-pointer justify-center">
                    <input className="peer sr-only" type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => onToggle(order.id)} />
                    <span className="flex h-5 w-5 rounded-md border border-[#a2a1a833] bg-[#e8e8e8] transition peer-checked:bg-[#7152f3] peer-checked:[&>svg]:stroke-white peer-checked:[&>svg]:opacity-100">
                      <svg className="h-5 w-5 stroke-[#e8e8e8] opacity-0" fill="none" viewBox="0 0 24 24">
                        <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </label>
                </td>
                <td>#{order.id}</td>
                <td>{order.date}</td>
                <td>{order.customer}</td>
                <td>
                  <span className={`admin-status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                </td>
                <td>
                  <button
                    type="button"
                    className={`admin-status button ${order.orderStatus.toLowerCase()}`}
                    onClick={() => onStatus(order.id)}
                  >
                    {order.orderStatus}
                  </button>
                </td>
                <td>{money(order.total)}</td>
                <td>
                  <div className="admin-row-actions">
                    <button type="button" className="edit" onClick={() => onStatus(order.id)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="delete" onClick={() => onDelete(order)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <AdminPagination page={page} totalPages={totalPages} totalResults={totalResults} onPage={onPage} />
      </section>
    </>
  )
}

function UsersScreen({
  users,
  roles,
  search,
  page,
  totalPages,
  totalResults,
  currentUserId,
  onSearch,
  onPage,
  onAddRole,
  onRemoveRole,
  onDelete,
}: {
  users: UserProfile[]
  roles: UserRole[]
  search: string
  page: number
  totalPages: number
  totalResults: number
  currentUserId: string
  onSearch: (value: string) => void
  onPage: (page: number) => void
  onAddRole: (userId: number, roleId: string) => void
  onRemoveRole: (userId: number, roleId: number) => void
  onDelete: (user: UserProfile) => void
}) {
  return (
    <>
      <div className="admin-page-title">
        <h1>Users</h1>
      </div>

      <section className="admin-card admin-users-card">
        <div className="admin-table-toolbar">
          <label className="admin-search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search user" />
          </label>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-data-table admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Date of birth</th>
                <th>Roles</th>
                <th>Add role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((profile) => {
                const userRoleIds = profile.userRoles.map((role) => role.id)
                const availableRoles = roles.filter((role) => !userRoleIds.includes(role.id))
                const isCurrentUser = currentUserId === String(profile.userId)

                return (
                  <tr key={profile.userId}>
                    <td>
                      <div className="admin-user-cell">
                        {profile.image ? (
                          <img src={getImageUrl(profile.image)} alt={profile.userName} />
                        ) : (
                          <span>{profile.userName.slice(0, 1).toUpperCase()}</span>
                        )}
                        <div>
                          <b>{profile.userName}</b>
                          <small>{profile.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{profile.phoneNumber ?? 'No phone'}</td>
                    <td>{profile.dob || 'No date'}</td>
                    <td>
                      <div className="admin-role-list">
                        {profile.userRoles.map((role) => (
                          <button
                            key={role.id}
                            type="button"
                            className="admin-role-pill"
                            onClick={() => onRemoveRole(profile.userId, role.id)}
                            disabled={isCurrentUser && role.name !== 'User'}
                            title="Remove role"
                          >
                            {role.name}
                            <span>x</span>
                          </button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <select
                        key={`${profile.userId}-${profile.userRoles.length}`}
                        className="admin-role-select"
                        defaultValue=""
                        onChange={(event) => {
                          if (event.target.value) {
                            onAddRole(profile.userId, event.target.value)
                          }
                        }}
                        disabled={!availableRoles.length}
                      >
                        <option value="">Choose role</option>
                        {availableRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-icon-button danger"
                        onClick={() => onDelete(profile)}
                        disabled={isCurrentUser}
                        title={isCurrentUser ? 'You cannot delete current user' : 'Delete user'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <AdminPagination page={page} totalPages={totalPages} totalResults={totalResults} onPage={onPage} />
      </section>
    </>
  )
}

function ProductFormScreen({
  form,
  brands,
  categories,
  colors,
  subCategories,
  newColorName,
  newSubCategoryName,
  loading,
  onBack,
  onChange,
  onCategoryChange,
  onNewColorName,
  onCreateColor,
  onNewSubCategoryName,
  onCreateSubCategory,
  onSubmit,
}: {
  form: ProductForm
  brands: Brand[]
  categories: Category[]
  colors: Color[]
  subCategories: SubCategoryItem[]
  newColorName: string
  newSubCategoryName: string
  loading: boolean
  onBack: () => void
  onChange: (key: string, value: string | boolean | FileList | null) => void
  onCategoryChange: (value: string) => void
  onNewColorName: (value: string) => void
  onCreateColor: () => void
  onNewSubCategoryName: (value: string) => void
  onCreateSubCategory: () => void
  onSubmit: (event: FormSubmit) => void
}) {
  return (
    <form className="admin-product-detail" onSubmit={onSubmit}>
      <div className="admin-page-title">
        <button type="button" className="admin-back-button" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <h1>Products / {form.id ? 'Edit' : 'Add new'}</h1>
        <div className="admin-title-actions">
          <button type="button" className="admin-secondary-button" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="admin-blue-button" disabled={loading}>
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <section className="admin-product-layout">
        <div className="admin-detail-left">
          <article className="admin-card admin-form-card">
            <h2>Information</h2>
            <div className="admin-form-grid two">
              <label>
                Product name
                <input
                  value={form.productName}
                  onChange={(event) => onChange('productName', event.target.value)}
                  placeholder="Logitech g435"
                  required
                />
              </label>
              <label>
                Product code
                <input value={form.code} onChange={(event) => onChange('code', event.target.value)} placeholder="BG-197" />
              </label>
            </div>

            <div className="admin-editor-toolbar">
              <button type="button">B</button>
              <button type="button">I</button>
              <button type="button">U</button>
              <button type="button">•</button>
              <button type="button">1.</button>
            </div>
            <textarea
              value={form.description}
              onChange={(event) => onChange('description', event.target.value)}
              placeholder="Product description"
            />

            <div className="admin-form-grid two">
              <label>
                Category
                <select value={form.categoryId} onChange={(event) => onCategoryChange(event.target.value)}>
                  <option value="">Choose category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Brand
                <select value={form.brandId} onChange={(event) => onChange('brandId', event.target.value)}>
                  <option value="">Choose brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Sub-category
                <select value={form.subCategoryId} onChange={(event) => onChange('subCategoryId', event.target.value)}>
                  <option value="">Choose sub-category</option>
                  {form.categoryId && !subCategories.length ? (
                    <option value="">General will be created on save</option>
                  ) : null}
                  {subCategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subCategoryName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Create sub-category
                <span className="admin-inline-field">
                  <input value={newSubCategoryName} onChange={(event) => onNewSubCategoryName(event.target.value)} />
                  <button type="button" onClick={onCreateSubCategory}>
                    <Plus size={15} />
                  </button>
                </span>
              </label>
            </div>
          </article>

          <article className="admin-card admin-form-card">
            <h2>Price</h2>
            <div className="admin-form-grid three">
              <label>
                Price
                <input value={form.price} type="number" onChange={(event) => onChange('price', event.target.value)} required />
              </label>
              <label>
                Discount price
                <input value={form.discountPrice} type="number" onChange={(event) => onChange('discountPrice', event.target.value)} />
              </label>
              <label>
                Count in stock
                <input value={form.quantity} type="number" onChange={(event) => onChange('quantity', event.target.value)} />
              </label>
            </div>
            <label className="admin-switch-row">
              <span>
                <b>Add discount</b>
                <small>Use discount price on store cards</small>
              </span>
              <span className="relative inline-flex cursor-pointer">
                <input className="peer sr-only" type="checkbox" checked={form.hasDiscount} onChange={(event) => onChange('hasDiscount', event.target.checked)} />
                <span className="flex h-5 w-5 rounded-md border border-[#a2a1a833] bg-[#e8e8e8] transition peer-checked:bg-[#7152f3] peer-checked:[&>svg]:stroke-white peer-checked:[&>svg]:opacity-100">
                  <svg className="h-5 w-5 stroke-[#e8e8e8] opacity-0" fill="none" viewBox="0 0 24 24">
                    <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </label>
          </article>

          <article className="admin-card admin-form-card">
            <h2>Different Options</h2>
            <div className="admin-form-grid two">
              <label>
                Size
                <input value={form.size} onChange={(event) => onChange('size', event.target.value)} placeholder="S,M,L,XL" />
              </label>
              <label>
                Weight
                <input value={form.weight} onChange={(event) => onChange('weight', event.target.value)} placeholder="0.5" />
              </label>
            </div>
          </article>
        </div>

        <aside className="admin-detail-right">
          <article className="admin-card admin-form-card">
            <h2>Colour</h2>
            <div className="admin-color-list">
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={form.colorId === String(color.id) ? 'active' : ''}
                  onClick={() => onChange('colorId', String(color.id))}
                  style={{ backgroundColor: getColorValue(color.colorName) }}
                  aria-label={color.colorName}
                />
              ))}
            </div>
            <label>
              Create new
              <span className="admin-inline-field">
                <input value={newColorName} onChange={(event) => onNewColorName(event.target.value)} placeholder="Magenta" />
                <button type="button" onClick={onCreateColor}>
                  <Plus size={15} />
                </button>
              </span>
            </label>
          </article>

          <article className="admin-card admin-form-card">
            <h2>Tags</h2>
            <div className="admin-tags">
              {(form.size || 'New, Popular').split(',').map((tag) => (
                <span key={tag}>{tag.trim()}</span>
              ))}
            </div>
          </article>

          <ProductImageUpload files={form.images} onFiles={(files) => onChange('images', files)} />
        </aside>
      </section>
    </form>
  )
}

function CategoriesScreen({
  categories,
  search,
  categoryName,
  categoryEditId,
  onSearch,
  onName,
  onFile,
  onSubmit,
  onAdd,
  onEdit,
  onDelete,
  onOpenBrands,
  onOpenBanners,
}: {
  categories: Category[]
  search: string
  categoryName: string
  categoryEditId: string
  onSearch: (value: string) => void
  onName: (value: string) => void
  onFile: (file: File | null) => void
  onSubmit: (event: FormSubmit) => void
  onAdd: () => void
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onOpenBrands: () => void
  onOpenBanners: () => void
}) {
  return (
    <>
      <OtherTabs active="categories" onCategories={() => undefined} onBrands={onOpenBrands} onBanners={onOpenBanners} />
      <div className="admin-page-title">
        <h1>Categories</h1>
        <button type="button" className="admin-blue-button" onClick={onAdd}>
          <Plus size={18} />
          Add new
        </button>
      </div>

      <form className="admin-inline-editor" onSubmit={onSubmit}>
        <b>{categoryEditId ? 'Edit category' : 'Add category'}</b>
        <input value={categoryName} onChange={(event) => onName(event.target.value)} placeholder="Category name" required />
        <input type="file" onChange={(event) => onFile(event.target.files?.[0] ?? null)} />
        <button type="submit" className="admin-blue-button">
          Save
        </button>
      </form>

      <section className="admin-card">
        <div className="admin-table-toolbar">
          <label className="admin-search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search category" />
          </label>
        </div>
        <div className="admin-category-grid">
          {categories.map((category) => (
            <article key={category.id} className="admin-category-card">
              {category.categoryImage ? (
                <img
                  className="admin-category-photo"
                  src={getImageUrl(category.categoryImage)}
                  alt={category.categoryName}
                />
              ) : (
                <span className="admin-category-icon">
                  <Image size={34} />
                </span>
              )}
              <b>{category.categoryName}</b>
              <button type="button" className="edit" onClick={() => onEdit(category)}>
                <Pencil size={16} />
              </button>
              <button type="button" className="delete" onClick={() => onDelete(category)}>
                <Trash2 size={15} />
              </button>
            </article>
          ))}
        </div>
        <AdminPagination page={1} totalPages={1} totalResults={categories.length} onPage={() => undefined} />
      </section>
    </>
  )
}

function BrandsScreen({
  brands,
  brandName,
  brandEditId,
  onName,
  onSubmit,
  onEdit,
  onDelete,
  onOpenCategories,
  onOpenBanners,
}: {
  brands: Brand[]
  brandName: string
  brandEditId: string
  onName: (value: string) => void
  onSubmit: (event: FormSubmit) => void
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
  onOpenCategories: () => void
  onOpenBanners: () => void
}) {
  return (
    <>
      <OtherTabs active="brands" onCategories={onOpenCategories} onBrands={() => undefined} onBanners={onOpenBanners} />
      <div className="admin-page-title">
        <h1>Brands</h1>
      </div>

      <section className="admin-brand-layout">
        <article className="admin-card">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Brands</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.brandName}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="edit" onClick={() => onEdit(brand)}>
                        <Pencil size={16} />
                      </button>
                      <button type="button" className="delete" onClick={() => onDelete(brand)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <form className="admin-card admin-brand-form" onSubmit={onSubmit}>
          <h2>{brandEditId ? 'Edit brand' : 'Add new brand'}</h2>
          <label>
            Brand name
            <input value={brandName} onChange={(event) => onName(event.target.value)} placeholder="Brand name" required />
          </label>
          <button type="submit" className="admin-blue-button">
            {brandEditId ? 'Update' : 'Create'}
          </button>
        </form>
      </section>
    </>
  )
}

function BannersScreen({
  banners,
  products,
  title,
  subtitle,
  onTitle,
  onSubtitle,
  onSubmit,
  onToggle,
  onDelete,
  onOpenCategories,
  onOpenBrands,
}: {
  banners: BannerItem[]
  products: Product[]
  title: string
  subtitle: string
  onTitle: (value: string) => void
  onSubtitle: (value: string) => void
  onSubmit: (event: FormSubmit) => void
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onOpenCategories: () => void
  onOpenBrands: () => void
}) {
  return (
    <>
      <OtherTabs active="banners" onCategories={onOpenCategories} onBrands={onOpenBrands} onBanners={() => undefined} />
      <div className="admin-page-title">
        <h1>Banners</h1>
      </div>

      <section className="admin-brand-layout">
        <article className="admin-card admin-banner-list">
          {banners.map((banner) => {
            const product = products.find((item) => item.id === banner.productId) ?? products[0]

            return (
              <div key={banner.id} className="admin-banner-row">
                <div className="admin-banner-preview">
                  <div>
                    <b>{banner.title}</b>
                    <span>{banner.subtitle}</span>
                  </div>
                  {product ? <img src={getImageUrl(product.image)} alt={product.productName} /> : <Image size={44} />}
                </div>
                <button type="button" className={banner.active ? 'admin-status paid' : 'admin-status pending'} onClick={() => onToggle(banner.id)}>
                  {banner.active ? 'Active' : 'Hidden'}
                </button>
                <button type="button" className="admin-icon-button danger" onClick={() => onDelete(banner.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </article>

        <form className="admin-card admin-brand-form" onSubmit={onSubmit}>
          <h2>Add new banner</h2>
          <label>
            Title
            <input value={title} onChange={(event) => onTitle(event.target.value)} placeholder="iPhone 14 Series" required />
          </label>
          <label>
            Subtitle
            <input value={subtitle} onChange={(event) => onSubtitle(event.target.value)} placeholder="Up to 10% off Voucher" required />
          </label>
          <button type="submit" className="admin-blue-button">
            Create
          </button>
        </form>
      </section>
    </>
  )
}

function OtherTabs({
  active,
  onCategories,
  onBrands,
  onBanners,
}: {
  active: 'categories' | 'brands' | 'banners'
  onCategories: () => void
  onBrands: () => void
  onBanners: () => void
}) {
  return (
    <div className="admin-tabs">
      <button type="button" className={active === 'categories' ? 'active' : ''} onClick={onCategories}>
        Categories
      </button>
      <button type="button" className={active === 'brands' ? 'active' : ''} onClick={onBrands}>
        Brands
      </button>
      <button type="button" className={active === 'banners' ? 'active' : ''} onClick={onBanners}>
        Banners
      </button>
    </div>
  )
}

function AdminPagination({
  page,
  totalPages,
  totalResults,
  onPage,
}: {
  page: number
  totalPages: number
  totalResults: number
  onPage: (page: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="admin-pagination-row">
      <span>{totalResults} Results</span>
      <div>
        <button type="button" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={16} />
        </button>
        {pages.map((item) => (
          <button key={item} type="button" className={item === page ? 'active' : ''} onClick={() => onPage(item)}>
            {item}
          </button>
        ))}
        <button type="button" disabled={page === totalPages} onClick={() => onPage(page + 1)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
