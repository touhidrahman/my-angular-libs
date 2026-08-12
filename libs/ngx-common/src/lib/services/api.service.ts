import { HttpClient } from '@angular/common/http'
import { Params } from '@angular/router'
import { Observable } from 'rxjs'
import { ApiResponse } from '../models/api-response.model'
import { AbstractApiService } from './abstract-api.service'

export class ApiService<T, TCreate> implements AbstractApiService<T, TCreate> {
    protected apiUrl: string
    protected http: HttpClient

    constructor(apiUrl: string, http: HttpClient) {
        this.apiUrl = apiUrl
        this.http = http
    }

    count(params: Params = {}): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count`, { params })
    }

    findById(id: string): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${id}`)
    }

    find(params: Params = {}): Observable<ApiResponse<T[]>> {
        return this.http.get<ApiResponse<T[]>>(this.apiUrl, { params })
    }

    search(term: string): Observable<ApiResponse<T[]>> {
        return this.http.get<ApiResponse<T[]>>(this.apiUrl, {
            params: { search: term },
        })
    }

    create(dto: TCreate): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(this.apiUrl, dto)
    }

    update(id: string, body: Partial<TCreate>): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(`${this.apiUrl}/${id}`, body)
    }

    delete(id: string): Observable<ApiResponse<unknown>> {
        return this.http.delete<ApiResponse<unknown>>(`${this.apiUrl}/${id}`)
    }

    deleteMany(ids: string[]): Observable<ApiResponse<unknown>> {
        return this.http.delete<ApiResponse<unknown>>(`${this.apiUrl}`, {
            body: ids,
        })
    }

    createMany(dto: TCreate[]): Observable<ApiResponse<T[]>> {
        return this.http.post<ApiResponse<T[]>>(`${this.apiUrl}/many`, dto)
    }
}
