import { Pipe, type PipeTransform } from '@angular/core'
import { capitalize } from 'es-toolkit/string'

@Pipe({
    name: 'titlecase',
    standalone: true,
})
export class TitlecasePipe implements PipeTransform {
    transform(value: unknown, ..._args: unknown[]): unknown {
        return capitalize(value as string)
    }
}
