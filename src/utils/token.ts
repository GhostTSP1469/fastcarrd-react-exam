import axios from 'axios'
import { apiUrl } from './apiUrl'

export function saveToken(token: string) {
  localStorage.setItem('store_token', token)
}

export const getToken = () => {
  return localStorage.getItem('store_token')
}

export function removeToken() {
  localStorage.removeItem('store_token')
}

export const axiosRequest = axios.create({
  baseURL: apiUrl,
})

axiosRequest.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)
