import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'msToTime',
    standalone: true,
})
export class MsToTimePipe implements PipeTransform {
    transform(miliseconds: number | string, format: 'min' | 'hr'): any {
        const ms = Number(miliseconds)
        const hours: number = Math.floor(ms / 3600000)
        const minutes: number = Math.floor((ms % 3600000) / 60000)

        const hoursStr = hours > 0 ? `${+hours}` : ''
        const minutesStr: string = minutes > 0 ? `${+minutes}` : ''

        if (format === 'min') {
            return `${minutesStr}`
        }
        return `${Number(hoursStr)}`
    }
}
