import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'ellipsis',
})
export class EllipsisPipe implements PipeTransform {
    transform(description: string, limit = 150): string {
        if (!description) return ''
        const plainText = description.replace(/<[^>]*>/g, '')
        return plainText.length > limit
            ? plainText.substring(0, limit) + '...'
            : plainText
    }
}
