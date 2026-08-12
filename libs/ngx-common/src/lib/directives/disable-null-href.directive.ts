import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
    selector: '[ngxDisableNullHref]',
    standalone: true,
})
export class DisableNullHrefDirective {
    constructor(private el: ElementRef) {}

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (!this.isValidUrl(this.el.nativeElement.href)) {
            event.preventDefault()
        }
    }

    isValidUrl(urlString: string) {
        try {
            new URL(urlString)
            return true
        } catch (_error) {
            return false
        }
    }
}
