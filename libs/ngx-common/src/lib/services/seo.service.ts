import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class SeoService {
    updateMetaData(data: {
        title?: string
        description?: string
        keywords?: string
        ogUrl?: string
        ogImage?: string
        ogTitle?: string
        ogDescription?: string
    }) {
        if (data.title) {
            document.title = data.title
        }
    }
}
