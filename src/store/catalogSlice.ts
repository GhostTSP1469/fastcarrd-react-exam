import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getBrands, type Brand } from '../api/brandApi'
import { getCategories, type Category } from '../api/categoryApi'
import { getColors, type Color } from '../api/colorApi'
import { getApiErrorMessage } from '../api/getApiErrorMessage'
import { getProducts, type Product } from '../api/productApi'
import { getSubCategories, type SubCategoryItem } from '../api/subCategoryApi'

type CatalogStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

type CatalogState = {
  brands: Brand[]
  categories: Category[]
  colors: Color[]
  products: Product[]
  subCategories: SubCategoryItem[]
  totalProducts: number
  totalPages: number
  currentPage: number
  status: CatalogStatus
  error: string | null
}

type CatalogPayload = {
  brands: Brand[]
  categories: Category[]
  colors: Color[]
  products: Product[]
  subCategories: SubCategoryItem[]
  totalProducts: number
  totalPages: number
  currentPage: number
}

const initialState: CatalogState = {
  brands: [],
  categories: [],
  colors: [],
  products: [],
  subCategories: [],
  totalProducts: 0,
  totalPages: 1,
  currentPage: 1,
  status: 'idle',
  error: null,
}

async function loadSubCategories(categories: Category[]) {
  const lists = await Promise.all(
    categories.map(async (category) => {
      try {
        const response = await getSubCategories(category.id)
        return response.data ?? []
      } catch {
        return []
      }
    }),
  )

  return lists.flat()
}

export const fetchCatalog = createAsyncThunk<
  CatalogPayload,
  void,
  { rejectValue: string }
>('catalog/fetchCatalog', async (_, { rejectWithValue }) => {
  try {
    const [brands, categories, colors, products] = await Promise.all([
      getBrands({ PageNumber: 1, PageSize: 100 }),
      getCategories(),
      getColors(),
      getProducts({ PageNumber: 1, PageSize: 100 }),
    ])
    const subCategories = await loadSubCategories(categories.data ?? [])

    return {
      brands: brands.data?.brands ?? [],
      categories: categories.data ?? [],
      colors: colors.data ?? [],
      products: products.data?.products ?? [],
      subCategories,
      totalProducts: products.data?.totalRecords ?? 0,
      totalPages: products.data?.totalPages ?? 1,
      currentPage: products.data?.currentPage ?? 1,
    }
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.brands = action.payload.brands
        state.categories = action.payload.categories
        state.colors = action.payload.colors
        state.products = action.payload.products
        state.subCategories = action.payload.subCategories
        state.totalProducts = action.payload.totalProducts
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Catalog loading failed.'
      })
  },
})

export default catalogSlice.reducer
