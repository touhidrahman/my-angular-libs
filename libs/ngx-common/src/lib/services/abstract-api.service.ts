import { Params } from '@angular/router'
import { Observable } from 'rxjs'
import { ApiResponse } from '../models/api-response.model'

export abstract class AbstractApiService<T, TCreate> {
    abstract findById(id: string): Observable<ApiResponse<T>>
    abstract find(params: Params): Observable<ApiResponse<T[]>>
    abstract search(term: string): Observable<ApiResponse<T[]>>
    abstract count(params: Params): Observable<number>
    abstract create(dto: TCreate): Observable<ApiResponse<T>>
    abstract createMany(dto: TCreate[]): Observable<ApiResponse<T[]>>
    abstract update(
        id: string,
        body: Partial<TCreate>,
    ): Observable<ApiResponse<T>>
    abstract delete(id: string): Observable<ApiResponse<unknown>>
    abstract deleteMany(ids: string[]): Observable<ApiResponse<unknown>>
}
