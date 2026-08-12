import { Directive, HostListener, Input } from '@angular/core'

@Directive({
    selector: '[ngxCopyToClipboard]',
    standalone: true,
})
export class CopyToClipboardDirective {
    @Input('ngxCopyToClipboard') copyText: string | undefined

    @HostListener('click')
    async handleClick() {
        try {
            await navigator.clipboard.writeText(this.copyText?.trim() ?? '')
        } catch (err) {
            console.error('Clipboard copy failed:', err)
        }
    }
}
