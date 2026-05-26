const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const nameIdKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'

export type AuthUser = {
  id: string
  name: string
  email: string
  roles: string[]
  expiresAt: number | null
}

type TokenData = {
  sid?: string
  id?: number | string
  userName?: string
  name?: string
  email?: string
  exp?: number
  role?: string | string[]
  [roleKey]?: string | string[]
  [nameIdKey]?: string
}

function decodeTokenPart(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const extraSymbols = (4 - base64.length % 4) % 4
  const normalBase64 = base64 + '='.repeat(extraSymbols)

  return atob(normalBase64)
}

export function getUserFromToken(token: string | null): AuthUser | null {
  if (!token) {
    return null
  }

  try {
    const tokenParts = token.split('.')
    const data = JSON.parse(decodeTokenPart(tokenParts[1])) as TokenData
    const roles = data.role ?? data[roleKey] ?? ['User']

    return {
      id: String(data.id ?? data.sid ?? data[nameIdKey] ?? ''),
      name: data.userName ?? data.name ?? 'User',
      email: data.email ?? '',
      roles: Array.isArray(roles) ? roles : [roles],
      expiresAt: data.exp ?? null,
    }
  } catch {
    return null
  }
}

export function isAdminUser(user: AuthUser | null) {
  return Boolean(
    user?.roles.some((role) => role === 'Admin' || role === 'SuperAdmin'),
  )
}

export function formatTokenDate(value: number | null) {
  if (!value) {
    return 'Unknown'
  }

  return new Date(value * 1000).toLocaleString()
}
