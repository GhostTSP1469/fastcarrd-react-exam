import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type WishlistState = {
  productIds: number[]
}

const wishlistKey = 'fastcart_wishlist'

function readWishlistIds() {
  try {
    const saved = localStorage.getItem(wishlistKey)

    if (!saved) {
      return []
    }

    const ids = JSON.parse(saved)

    if (!Array.isArray(ids)) {
      return []
    }

    return ids.filter((id) => typeof id === 'number')
  } catch {
    return []
  }
}

function saveWishlistIds(ids: number[]) {
  localStorage.setItem(wishlistKey, JSON.stringify(ids))
}

const initialState: WishlistState = {
  productIds: readWishlistIds(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistProduct(state, action: PayloadAction<number>) {
      if (state.productIds.includes(action.payload)) {
        state.productIds = state.productIds.filter((id) => id !== action.payload)
      } else {
        state.productIds.push(action.payload)
      }
      saveWishlistIds(state.productIds)
    },
    clearWishlist(state) {
      state.productIds = []
      saveWishlistIds([])
    },
  },
})

export const { clearWishlist, toggleWishlistProduct } = wishlistSlice.actions
export default wishlistSlice.reducer
