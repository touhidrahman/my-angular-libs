import { Pipe, PipeTransform } from '@angular/core'
import { uniq } from 'es-toolkit/array'

@Pipe({
    name: 'unique',
    standalone: true,
})
export class UniquePipe<T> implements PipeTransform {
    transform(value: T[]): T[] {
        return uniq(value)
    }
}
