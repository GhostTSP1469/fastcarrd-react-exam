import { ArrowLeft, CheckCircle, Pencil, Percent, Plus, Trash2, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addColor,
  addBrand,
  addCategory,
  addProduct,
  addRoleToUser,
  addSubCategory,
  deleteBrand,
  deleteCategory,
  deleteProduct,
  deleteUser,
  getBrands,
  getCategories,
  getColors,
  getProducts,
  getRoles,
  getSubCategories,
  getUsers,
  removeRoleFromUser,
  updateBrand,
  updateCategory,
  updateProduct,
} from '../api/adminApi'
import { AdminLayout } from '../components/AdminLayout'
import { SalesChart } from '../components/SalesChart'
import type { AdminUser, Brand, Category, Color, Product, Role, SubCategory, UserProfile } from '../types'
import { removeToken } from '../utils/auth'
import { getImageUrl } from '../utils/images'

type Screen = 'dashboard' | 'orders' | 'products' | 'productForm' | 'categories' | 'brands' | 'users'

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
  customer: string
  date: string
  amount: number
  status: 'Paid' | 'Pending'
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

function money(value: number) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

function asNumber(value: string) {
  return value ? Number(value) : undefined
}

function getColorValue(name: string) {
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, '')
  const colors = [
    { name: 'black', value: '#111827' },
    { name: 'white', value: '#f8fafc' },
    { name: 'red', value: '#ef4444' },
    { name: 'blue', value: '#3b82f6' },
    { name: 'skyblue', value: '#38bdf8' },
    { name: 'green', value: '#22c55e' },
    { name: 'gold', value: '#f59e0b' },
    { name: 'silver', value: '#cbd5e1' },
    { name: 'magenta', value: '#d946ef' },
    { name: 'purple', value: '#8b5cf6' },
    { name: 'pink', value: '#ec4899' },
    { name: 'gray', value: '#94a3b8' },
  ]
  const found = colors.find((color) => color.name === cleanName)

  return found?.value ?? cleanName
}

function makeOrders(products: Product[], users: UserProfile[]) {
  if (!products.length) {
    return []
  }

  return products.slice(0, 8).map((product, index) => ({
    id: 2400 + product.id,
    customer: users[index]?.userName ?? 'Customer',
    date: `24.05.202${index % 4}`,
    amount: product.hasDiscount && product.discountPrice ? product.discountPrice : product.price,
    status: index % 3 === 0 ? 'Pending' : 'Paid',
  })) as AdminOrder[]
}

export function DashboardPage({
  user,
}: {
  token: string
  user: AdminUser | null
}) {
  const navigate = useNavigate()
  const adminUser = user ?? { id: '', name: 'Admin', email: '', roles: ['Admin'] }
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('Loading admin data...')
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm)
  const [brandName, setBrandName] = useState('')
  const [brandEditId, setBrandEditId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryEditId, setCategoryEditId] = useState('')
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [newColorName, setNewColorName] = useState('')
  const [newSubCategoryName, setNewSubCategoryName] = useState('')

  const orders = makeOrders(products, users)
  const salesTotal = products.reduce((sum, product) => sum + product.price * (product.quantity ?? 1), 0)
  const costTotal = Math.round(salesTotal * 0.65)
  const profitTotal = Math.max(0, salesTotal - costTotal)
  const searchText = search.toLowerCase().trim()
  const visibleProducts = products.filter((product) => product.productName.toLowerCase().includes(searchText))
  const visibleOrders = orders.filter((order) => order.customer.toLowerCase().includes(searchText) || String(order.id).includes(searchText))
  const visibleCategories = categories.filter((category) => category.categoryName.toLowerCase().includes(searchText))
  const visibleBrands = brands.filter((brand) => brand.brandName.toLowerCase().includes(searchText))
  const visibleUsers = users.filter((profile) => profile.userName.toLowerCase().includes(searchText) || profile.email.toLowerCase().includes(searchText))
  const topProducts = [...products].sort((left, right) => (right.quantity ?? 0) - (left.quantity ?? 0)).slice(0, 5)

  async function loadData() {
    try {
      const [productsResult, brandsResult, categoriesResult, colorsResult, usersResult, rolesResult] = await Promise.all([
        getProducts(),
        getBrands(),
        getCategories(),
        getColors(),
        getUsers(),
        getRoles(),
      ])

      setProducts(productsResult.data?.products ?? [])
      setBrands(brandsResult.data?.brands ?? [])
      setCategories(categoriesResult.data ?? [])
      setColors(colorsResult.data ?? [])
      setUsers(usersResult.data?.userProfiles ?? [])
      setRoles(rolesResult.data ?? [])
      setMessage('Admin data loaded')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Loading failed')
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  function logout() {
    removeToken()
    navigate('/login')
  }

  function changeProductField(key: string, value: string | boolean | FileList | null) {
    setProductForm((form) => ({ ...form, [key]: value }))
  }

  async function loadSubCategoryOptions(categoryId: string) {
    if (!categoryId) {
      setSubCategories([])
      return
    }

    try {
      const response = await getSubCategories(Number(categoryId))
      setSubCategories(response.data ?? [])
    } catch {
      setSubCategories([])
    }
  }

  function openProductForm(product?: Product) {
    if (!product) {
      setProductForm(emptyProductForm)
      setSubCategories([])
      setScreen('productForm')
      return
    }

    const categoryId = String(product.categoryId ?? '')

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
    void loadSubCategoryOptions(categoryId)
    setScreen('productForm')
  }

  async function saveProduct(event: { preventDefault: () => void }) {
    event.preventDefault()

    try {
      if (productForm.id) {
        await updateProduct({
          Id: Number(productForm.id),
          ProductName: productForm.productName,
          Description: productForm.description || undefined,
          Price: asNumber(productForm.price),
          Quantity: asNumber(productForm.quantity),
          BrandId: asNumber(productForm.brandId),
          ColorId: asNumber(productForm.colorId),
          SubCategoryId: asNumber(productForm.subCategoryId),
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
        if (productForm.subCategoryId) formData.append('SubCategoryId', productForm.subCategoryId)

        Array.from(productForm.images ?? []).forEach((file) => {
          formData.append('Images', file)
        })

        await addProduct(formData)
      }

      setProductForm(emptyProductForm)
      setScreen('products')
      setMessage(productForm.id ? 'Product updated' : 'Product created')
      await loadData()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Product save failed')
    }
  }

  async function createColor() {
    if (!newColorName.trim()) {
      return
    }

    try {
      await addColor(newColorName)
      setNewColorName('')
      await loadData()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Color create failed')
    }
  }

  async function createSubCategory() {
    if (!productForm.categoryId || !newSubCategoryName.trim()) {
      return
    }

    try {
      await addSubCategory(Number(productForm.categoryId), newSubCategoryName)
      setNewSubCategoryName('')
      await loadSubCategoryOptions(productForm.categoryId)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sub-category create failed')
    }
  }

  async function createBrand(event: { preventDefault: () => void }) {
    event.preventDefault()

    if (!brandName.trim()) {
      return
    }

    if (brandEditId) {
      await updateBrand(Number(brandEditId), brandName)
    } else {
      await addBrand(brandName)
    }

    setBrandName('')
    setBrandEditId('')
    await loadData()
  }

  async function createCategory(event: { preventDefault: () => void }) {
    event.preventDefault()

    if (!categoryName.trim()) {
      return
    }

    const formData = new FormData()
    formData.append('CategoryName', categoryName)
    if (categoryEditId) {
      formData.append('Id', categoryEditId)
    }
    if (categoryImage) {
      formData.append('CategoryImage', categoryImage)
    }

    if (categoryEditId) {
      await updateCategory(formData)
    } else {
      await addCategory(formData)
    }

    setCategoryName('')
    setCategoryEditId('')
    setCategoryImage(null)
    await loadData()
  }

  async function giveRole(userId: number, roleId: string) {
    if (!roleId) {
      return
    }

    await addRoleToUser(userId, Number(roleId))
    await loadData()
  }

  return (
    <AdminLayout
      screen={screen}
      user={adminUser}
      orderCount={orders.length}
      userCount={users.length}
      search={search}
      onSearch={setSearch}
      onScreen={setScreen}
      onLogout={logout}
    >
      <>
        <div className="admin-message-row">
          <span>{message}</span>
          <button type="button" onClick={() => void loadData()}>
            Refresh
          </button>
        </div>

        {screen === 'dashboard' ? (
          <>
            <h1 className="admin-page-title">Dashboard</h1>
            <section className="admin-stat-grid">
              <StatCard icon="sales" title="Sales" value={money(salesTotal)} />
              <StatCard icon="cost" title="Cost" value={money(costTotal)} />
              <StatCard icon="profit" title="Profit" value={money(profitTotal)} />
            </section>
            <section className="admin-dashboard-grid">
              <SalesChart />
              <TopSelling products={topProducts} onSeeAll={() => setScreen('products')} />
            </section>
            <section className="admin-bottom-grid">
              <OrdersTable orders={orders.slice(0, 6)} />
              <ProductsTable products={topProducts} onEdit={() => undefined} onDelete={() => undefined} small />
            </section>
          </>
        ) : null}

        {screen === 'products' ? (
          <>
            <div className="admin-title-row">
              <h1 className="admin-page-title">Products</h1>
              <button type="button" onClick={() => openProductForm()}>
                <Plus size={18} />
                Add product
              </button>
            </div>
            <ProductsTable
              products={visibleProducts}
              onEdit={openProductForm}
              onDelete={async (product) => {
                await deleteProduct(product.id)
                await loadData()
              }}
            />
          </>
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
            onBack={() => setScreen('products')}
            onChange={changeProductField}
            onCategoryChange={(value) => {
              changeProductField('categoryId', value)
              changeProductField('subCategoryId', '')
              void loadSubCategoryOptions(value)
            }}
            onNewColorName={setNewColorName}
            onCreateColor={() => void createColor()}
            onNewSubCategoryName={setNewSubCategoryName}
            onCreateSubCategory={() => void createSubCategory()}
            onSubmit={saveProduct}
          />
        ) : null}

        {screen === 'orders' ? (
          <>
            <h1 className="admin-page-title">Orders</h1>
            <OrdersTable orders={visibleOrders} />
          </>
        ) : null}

        {screen === 'categories' ? (
          <>
            <div className="admin-tabs">
              <button className="active" type="button">
                Categories
              </button>
              <button type="button" onClick={() => setScreen('brands')}>
                Brands
              </button>
            </div>
            <h1 className="admin-page-title">Categories</h1>
            <form className="admin-form-row" onSubmit={createCategory}>
              <input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Category name" />
              <input type="file" onChange={(event) => setCategoryImage(event.target.files?.[0] ?? null)} />
              <button type="submit">{categoryEditId ? 'Update category' : 'Add category'}</button>
              {categoryEditId ? (
                <button
                  type="button"
                  onClick={() => {
                    setCategoryEditId('')
                    setCategoryName('')
                    setCategoryImage(null)
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </form>
            <CategoryGrid
              categories={visibleCategories}
              onEdit={(category) => {
                setCategoryEditId(String(category.id))
                setCategoryName(category.categoryName)
                setCategoryImage(null)
              }}
              onDelete={async (category) => {
                await deleteCategory(category.id)
                await loadData()
              }}
            />
          </>
        ) : null}

        {screen === 'brands' ? (
          <>
            <div className="admin-tabs">
              <button type="button" onClick={() => setScreen('categories')}>
                Categories
              </button>
              <button className="active" type="button">
                Brands
              </button>
            </div>
            <h1 className="admin-page-title">Brands</h1>
            <form className="admin-form-row" onSubmit={createBrand}>
              <input value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Brand name" />
              <button type="submit">{brandEditId ? 'Update brand' : 'Add brand'}</button>
              {brandEditId ? (
                <button
                  type="button"
                  onClick={() => {
                    setBrandEditId('')
                    setBrandName('')
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </form>
            <BrandsTable
              brands={visibleBrands}
              onEdit={(brand) => {
                setBrandEditId(String(brand.id))
                setBrandName(brand.brandName)
              }}
              onDelete={async (brand) => {
                await deleteBrand(brand.id)
                await loadData()
              }}
            />
          </>
        ) : null}

        {screen === 'users' ? (
          <>
            <h1 className="admin-page-title">Users</h1>
            <UsersTable
              users={visibleUsers}
              roles={roles}
              currentUserId={adminUser.id}
              onAddRole={giveRole}
              onRemoveRole={async (userId, roleId) => {
                await removeRoleFromUser(userId, roleId)
                await loadData()
              }}
              onDelete={async (profile) => {
                await deleteUser(profile.userId)
                await loadData()
              }}
            />
          </>
        ) : null}
      </>
    </AdminLayout>
  )
}

function StatCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <article className={`admin-stat-card ${icon}`}>
      <span>{icon === 'sales' ? <TrendingUp /> : icon === 'cost' ? <Percent /> : <CheckCircle />}</span>
      <div>
        <small>{title}</small>
        <strong>{value}</strong>
      </div>
    </article>
  )
}

function TopSelling({
  products,
  onSeeAll,
}: {
  products: Product[]
  onSeeAll: () => void
}) {
  return (
    <article className="admin-card admin-top-selling">
      <div className="admin-card-title">
        <h2>Top selling products</h2>
        <button type="button" onClick={onSeeAll}>See All</button>
      </div>
      {products.map((product) => (
        <div key={product.id} className="admin-selling-row">
          <img src={getImageUrl(product.image)} alt={product.productName} />
          <div>
            <b>{product.productName}</b>
            <small>{product.categoryName ?? 'Product'}</small>
          </div>
          <span>{product.quantity ?? 0}</span>
        </div>
      ))}
    </article>
  )
}

function ProductsTable({
  products,
  small,
  onEdit,
  onDelete,
}: {
  products: Product[]
  small?: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}) {
  return (
    <article className="admin-card">
      <table className={small ? 'admin-table small' : 'admin-table'}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            {!small ? <th>Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="admin-product-cell">
                  <img src={getImageUrl(product.image)} alt={product.productName} />
                  <span>{product.productName}</span>
                </div>
              </td>
              <td>{product.categoryName ?? 'Product'}</td>
              <td>{money(product.hasDiscount && product.discountPrice ? product.discountPrice : product.price)}</td>
              <td>{product.quantity ?? 0}</td>
              {!small ? (
                <td>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => onEdit(product)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="danger" onClick={() => onDelete(product)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
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
  subCategories: SubCategory[]
  newColorName: string
  newSubCategoryName: string
  onBack: () => void
  onChange: (key: string, value: string | boolean | FileList | null) => void
  onCategoryChange: (value: string) => void
  onNewColorName: (value: string) => void
  onCreateColor: () => void
  onNewSubCategoryName: (value: string) => void
  onCreateSubCategory: () => void
  onSubmit: (event: { preventDefault: () => void }) => void
}) {
  const selectedFiles = Array.from(form.images ?? [])

  return (
    <form className="admin-product-form" onSubmit={onSubmit}>
      <div className="admin-title-row">
        <h1 className="admin-page-title">Products / {form.id ? 'Edit' : 'Add new'}</h1>
        <button type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <section className="admin-form-grid">
        <article className="admin-card admin-edit-card">
          <h2>Information</h2>
          <div className="admin-input-grid two">
            <label>
              Product name
              <input value={form.productName} onChange={(event) => onChange('productName', event.target.value)} required />
            </label>
            <label>
              Product code
              <input value={form.code} onChange={(event) => onChange('code', event.target.value)} />
            </label>
          </div>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => onChange('description', event.target.value)} />
          </label>
          <div className="admin-input-grid two">
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
              Sub-category
              <select value={form.subCategoryId} onChange={(event) => onChange('subCategoryId', event.target.value)}>
                <option value="">Choose sub-category</option>
                {subCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.subCategoryName}
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
              Create sub-category
              <span className="admin-inline-field">
                <input value={newSubCategoryName} onChange={(event) => onNewSubCategoryName(event.target.value)} />
                <button type="button" onClick={onCreateSubCategory}>
                  <Plus size={16} />
                </button>
              </span>
            </label>
          </div>
        </article>

        <article className="admin-card admin-edit-card">
          <h2>Price and stock</h2>
          <div className="admin-input-grid three">
            <label>
              Price
              <input type="number" value={form.price} onChange={(event) => onChange('price', event.target.value)} required />
            </label>
            <label>
              Discount price
              <input type="number" value={form.discountPrice} onChange={(event) => onChange('discountPrice', event.target.value)} />
            </label>
            <label>
              Quantity
              <input type="number" value={form.quantity} onChange={(event) => onChange('quantity', event.target.value)} />
            </label>
            <label>
              Size
              <input value={form.size} onChange={(event) => onChange('size', event.target.value)} placeholder="S,M,L,XL" />
            </label>
            <label>
              Weight
              <input value={form.weight} onChange={(event) => onChange('weight', event.target.value)} />
            </label>
            <label className="admin-checkbox-row">
              <input type="checkbox" checked={form.hasDiscount} onChange={(event) => onChange('hasDiscount', event.target.checked)} />
              Has discount
            </label>
          </div>
        </article>

        <article className="admin-card admin-edit-card">
          <h2>Colour</h2>
          <div className="admin-color-list">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                className={form.colorId === String(color.id) ? 'active' : ''}
                onClick={() => onChange('colorId', String(color.id))}
                style={{ backgroundColor: getColorValue(color.colorName) }}
                title={color.colorName}
              />
            ))}
          </div>
          <label>
            Create color
            <span className="admin-inline-field">
              <input value={newColorName} onChange={(event) => onNewColorName(event.target.value)} placeholder="Skyblue" />
              <button type="button" onClick={onCreateColor}>
                <Plus size={16} />
              </button>
            </span>
          </label>
        </article>

        <article className="admin-card admin-edit-card">
          <h2>Images</h2>
          <label className="admin-upload-box">
            <span>Choose product images</span>
            <small>Multiple files for product gallery</small>
            <input type="file" multiple accept="image/*" onChange={(event) => onChange('images', event.target.files)} />
          </label>
          <div className="admin-file-list">
            {selectedFiles.length ? selectedFiles.map((file) => <span key={`${file.name}-${file.size}`}>{file.name}</span>) : 'No new image selected'}
          </div>
        </article>
      </section>

      <div className="admin-save-row">
        <button type="button" onClick={onBack}>
          Cancel
        </button>
        <button type="submit">{form.id ? 'Update product' : 'Create product'}</button>
      </div>
    </form>
  )
}

function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  return (
    <article className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>{money(order.amount)}</td>
              <td>
                <span className={`admin-status ${order.status.toLowerCase()}`}>{order.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

function CategoryGrid({
  categories,
  onEdit,
  onDelete,
}: {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}) {
  return (
    <section className="admin-category-grid">
      {categories.map((category) => (
        <article key={category.id} className="admin-category-card">
          <img src={getImageUrl(category.categoryImage)} alt={category.categoryName} />
          <b>{category.categoryName}</b>
          <div className="admin-row-actions">
            <button type="button" onClick={() => onEdit(category)}>
              <Pencil size={16} />
            </button>
            <button type="button" className="danger" onClick={() => onDelete(category)}>
              <Trash2 size={16} />
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}

function BrandsTable({
  brands,
  onEdit,
  onDelete,
}: {
  brands: Brand[]
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
}) {
  return (
    <article className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>{brand.brandName}</td>
              <td>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => onEdit(brand)}>
                    <Pencil size={16} />
                  </button>
                  <button type="button" className="danger" onClick={() => onDelete(brand)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

function UsersTable({
  users,
  roles,
  currentUserId,
  onAddRole,
  onRemoveRole,
  onDelete,
}: {
  users: UserProfile[]
  roles: Role[]
  currentUserId: string
  onAddRole: (userId: number, roleId: string) => void
  onRemoveRole: (userId: number, roleId: number) => void
  onDelete: (profile: UserProfile) => void
}) {
  return (
    <article className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Phone</th>
            <th>Roles</th>
            <th>Add role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((profile) => {
            const currentUser = currentUserId === String(profile.userId)
            const userRoleIds = profile.userRoles.map((role) => role.id)

            return (
              <tr key={profile.userId}>
                <td>
                  <div className="admin-product-cell">
                    <img src={getImageUrl(profile.image)} alt={profile.userName} />
                    <span>{profile.userName}</span>
                  </div>
                  <small>{profile.email}</small>
                </td>
                <td>{profile.phoneNumber ?? 'No phone'}</td>
                <td>
                  <div className="admin-role-list">
                    {profile.userRoles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        disabled={currentUser}
                        onClick={() => onRemoveRole(profile.userId, role.id)}
                      >
                        {role.name}
                      </button>
                    ))}
                  </div>
                </td>
                <td>
                  <select defaultValue="" onChange={(event) => onAddRole(profile.userId, event.target.value)}>
                    <option value="">Choose role</option>
                    {roles
                      .filter((role) => !userRoleIds.includes(role.id))
                      .map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <button type="button" className="admin-delete-button" disabled={currentUser} onClick={() => onDelete(profile)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </article>
  )
}
