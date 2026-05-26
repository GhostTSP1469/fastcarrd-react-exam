export type ApiResponse<T> = {
  data: T
  statusCode: number
  message?: string
}

export type AdminUser = {
  id: string
  name: string
  email: string
  roles: string[]
}

export type Product = {
  id: number
  productName: string
  code?: string | null
  description?: string | null
  price: number
  discountPrice?: number | null
  hasDiscount?: boolean
  quantity?: number | null
  weight?: string | null
  size?: string | null
  image?: string | null
  images?: string[]
  categoryName?: string | null
  brandId?: number | null
  colorId?: number | null
  subCategoryId?: number | null
  categoryId?: number | null
}

export type ProductsData = {
  products: Product[]
  totalRecords: number
  totalPages: number
  currentPage: number
}

export type Brand = {
  id: number
  brandName: string
}

export type BrandsData = {
  brands: Brand[]
  totalRecords: number
  totalPages: number
  currentPage: number
}

export type Category = {
  id: number
  categoryName: string
  categoryImage?: string | null
}

export type Color = {
  id: number
  colorName: string
}

export type SubCategory = {
  id: number
  subCategoryName: string
  categoryId: number
}

export type Role = {
  id: number
  name: string
}

export type UserProfile = {
  userId: number
  userName: string
  firstName?: string | null
  lastName?: string | null
  email: string
  phoneNumber?: string | null
  dob?: string | null
  image?: string | null
  userRoles: Role[]
}

export type UsersData = {
  userProfiles: UserProfile[]
  totalRecords: number
  totalPages: number
  currentPage: number
}
