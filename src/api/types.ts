export type ApiResponse<T> = {
  data: T
  statusCode: number
  message?: string
  error?: string
  errors?: string[]
}

export type PaginationParams = {
  PageNumber?: number
  PageSize?: number
}

export type PageInfo = {
  totalRecords: number
  totalPages: number
  currentPage: number
}
