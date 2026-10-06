import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ThemeService {
    isDarkMode = signal<boolean>(false)

    toggleTheme(darkClassName = 'dark') {
        this.isDarkMode.update((v) => !v)
        document.documentElement.classList.toggle(
            darkClassName,
            this.isDarkMode(),
        )
    }
}
