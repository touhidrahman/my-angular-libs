import { HttpParams } from '@angular/common/http'

/**
 *  Converts a plain object into Angular Http Param
 *
 * @export
 * @param {Record<string, any>} object
 * @returns {*}
 */
export function toHttpParams(object: Record<string, any>) {
    let params = new HttpParams()

    Object.entries(object).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
            value.forEach((v) => {
                params = params.append(key, v)
            })
        } else {
            params = params.set(key, value)
        }
    })

    return params
}
