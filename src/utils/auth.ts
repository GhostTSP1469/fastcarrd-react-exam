import type { AdminUser } from '../types'

const tokenKey = 'admin2_token'

type TokenBody = {
  id?: number | string
  sid?: string
  sub?: number | string
  userName?: string
  name?: string
  email?: string
  role?: string[] | string
  exp?: number
}

export function saveToken(token: string) {
  localStorage.setItem(tokenKey, token)
}

export function getToken() {
  return localStorage.getItem(tokenKey)
}

export function removeToken() {
  localStorage.removeItem(tokenKey)
}

export function getUserFromToken(token: string): AdminUser | null {
  try {
    const tokenPart = token.split('.')[1]
    const fixedPart = tokenPart.replace(/-/g, '+').replace(/_/g, '/')
    const body = JSON.parse(atob(fixedPart)) as TokenBody
    const roles = Array.isArray(body.role) ? body.role : [body.role ?? 'User']

    return {
      id: String(body.id ?? body.sid ?? body.sub ?? ''),
      name: body.userName ?? body.name ?? 'Admin',
      email: body.email ?? '',
      roles,
    }
  } catch {
    return null
  }
}

export function isAdmin(user: AdminUser | null) {
  if (!user) {
    return false
  }

  return user.roles.includes('Admin') || user.roles.includes('SuperAdmin')
}
