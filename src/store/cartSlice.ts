import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CartItem = {
  productId: number
  quantity: number
}

type CartState = {
  items: CartItem[]
}

const cartKey = 'fastcart_cart'

function readCartItems() {
  try {
    const saved = localStorage.getItem(cartKey)

    if (!saved) {
      return []
    }

    const items = JSON.parse(saved)

    if (!Array.isArray(items)) {
      return []
    }

    return items.filter((item) => {
      return typeof item.productId === 'number' && typeof item.quantity === 'number'
    }) as CartItem[]
  } catch {
    return []
  }
}

function saveCartItems(items: CartItem[]) {
  localStorage.setItem(cartKey, JSON.stringify(items))
}

function copyCartItems(items: CartItem[]) {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }))
}

const initialState: CartState = {
  items: readCartItems(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (cartItem) => cartItem.productId === action.payload,
      )

      if (item) {
        item.quantity += 1
      } else {
        state.items.push({ productId: action.payload, quantity: 1 })
      }
      saveCartItems(copyCartItems(state.items))
    },
    increaseCartProduct(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (cartItem) => cartItem.productId === action.payload,
      )

      if (item) {
        item.quantity += 1
      }
      saveCartItems(copyCartItems(state.items))
    },
    reduceCartProduct(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (cartItem) => cartItem.productId === action.payload,
      )

      if (!item) {
        return
      }

      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        state.items = state.items.filter(
          (cartItem) => cartItem.productId !== action.payload,
        )
      }
      saveCartItems(copyCartItems(state.items))
    },
    removeCartProduct(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (cartItem) => cartItem.productId !== action.payload,
      )
      saveCartItems(copyCartItems(state.items))
    },
    clearUserCart(state) {
      state.items = []
      saveCartItems([])
    },
  },
})

export const {
  addToCart,
  clearUserCart,
  increaseCartProduct,
  reduceCartProduct,
  removeCartProduct,
} = cartSlice.actions

export default cartSlice.reducer
