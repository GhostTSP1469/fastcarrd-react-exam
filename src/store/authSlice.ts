import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  loginAccount,
  registerAccount,
  type LoginRequest,
  type RegisterRequest,
} from '../api/auth'
import { getApiErrorMessage } from '../api/getApiErrorMessage'
import { getUserFromToken, type AuthUser } from '../utils/authUser'
import { getToken, removeToken, saveToken } from '../utils/token'

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

type AuthState = {
  token: string | null
  user: AuthUser | null
  status: AuthStatus
  error: string | null
}

const savedToken = getToken()

const initialState: AuthState = {
  token: savedToken,
  user: getUserFromToken(savedToken),
  status: 'idle',
  error: null,
}

function saveAuthToken(token: string) {
  saveToken(token)
  return token
}

export const loginUser = createAsyncThunk<
  string,
  LoginRequest,
  { rejectValue: string }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await loginAccount(payload)

    if (!response.data) {
      return rejectWithValue(response.message ?? 'Login failed.')
    }

    return saveAuthToken(response.data)
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

export const registerUser = createAsyncThunk<
  string,
  RegisterRequest,
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const response = await registerAccount(payload)

    if (!response.data) {
      return rejectWithValue(response.message ?? 'Registration failed.')
    }

    return saveAuthToken(response.data)
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
      removeToken()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload
        state.user = getUserFromToken(action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Login failed.'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload
        state.user = getUserFromToken(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Registration failed.'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
