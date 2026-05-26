import { axiosRequest } from '../utils/token'
import type { ApiResponse, PageInfo, PaginationParams } from './types'

export type UserRole = {
  id: number
  name: string
}

export type UserProfile = {
  userId: number
  userName: string
  firstName: string | null
  lastName: string | null
  email: string
  phoneNumber: string | null
  dob: string | null
  image: string | null
  userRoles: UserRole[]
  token?: string | null
}

export type UserProfilesPageData = PageInfo & {
  userProfiles: UserProfile[]
}

export type GetUserProfilesParams = PaginationParams & {
  UserName?: string
}

export async function getUserProfiles(params?: GetUserProfilesParams) {
  const { data } = await axiosRequest.get<ApiResponse<UserProfilesPageData>>(
    '/UserProfile/get-user-profiles',
    { params },
  )

  return data
}

export async function getUserProfileById(id: number) {
  const { data } = await axiosRequest.get<ApiResponse<UserProfile>>(
    '/UserProfile/get-user-profile-by-id',
    { params: { id } },
  )

  return data
}

export async function getUserRoles() {
  const { data } = await axiosRequest.get<ApiResponse<UserRole[]>>(
    '/UserProfile/get-user-roles',
  )

  return data
}

export async function addRoleToUser(userId: number, roleId: number) {
  const { data } = await axiosRequest.post<ApiResponse<null>>(
    '/UserProfile/addrole-from-user',
    { userId, roleId },
  )

  return data
}

export async function removeRoleFromUser(userId: number, roleId: number) {
  const { data } = await axiosRequest.delete<ApiResponse<null>>(
    '/UserProfile/remove-role-from-user',
    { params: { UserId: userId, RoleId: roleId } },
  )

  return data
}

export async function deleteUser(id: number) {
  const { data } = await axiosRequest.delete<ApiResponse<null>>(
    '/UserProfile/delete-user',
    { params: { id } },
  )

  return data
}

export async function updateUserProfile(formData: FormData) {
  const { data } = await axiosRequest.put<ApiResponse<UserProfile>>(
    '/UserProfile/update-user-profile',
    formData,
  )

  return data
}
