export interface ApiResponseMeta {
    [Key: string]: unknown
}
export interface ApiResponsePagination {
    totalPages?: number
    totalItems?: number
    page?: number
    size?: number
}

export interface ApiResponse<T> {
    data: T
    meta?: ApiResponseMeta
    pagination?: ApiResponsePagination
    error?: unknown
    message?: string
    success?: boolean
}
