import { effect, signal, WritableSignal } from '@angular/core'
import destr from 'destr'

export interface StorageSignalOptions<T> {
    /** Storage instance to use. Default is localStorage */
    storage?: Storage
    /** Serializer function to use. Default is `serialize` function from `serialize-javascript` library */
    serializer?: (v: T) => string
    /** Deserializer function to use. Default is `destr` function from `destr` library */
    deserializer?: (raw: string) => T
    /** Whether to sync changes across tabs. Default is true, when window object is available */
    crossTabSync?: boolean
}

export function storageSignal<T>(
    key: string,
    defaultValue: T,
    options: StorageSignalOptions<T> = {},
): WritableSignal<T> {
    const {
        storage = localStorage,
        serializer = JSON.stringify,
        deserializer = destr,
        crossTabSync = true,
    } = options

    let initial = defaultValue
    try {
        const raw = storage.getItem(key)
        if (raw !== null) initial = deserializer(raw)
    } catch {}

    const state = signal<T>(initial)

    effect(() => {
        try {
            storage.setItem(key, serializer(state()))
        } catch (err) {
            console.error(`[storageSignal] Persist failed for ${key}:`, err)
        }
    })

    if (crossTabSync && typeof window !== 'undefined') {
        window.addEventListener('storage', (ev: StorageEvent) => {
            if (ev.key !== key || ev.storageArea !== storage) return
            if (ev.newValue === null) return
            try {
                state.set(deserializer(ev.newValue))
            } catch {
                // ignore malformed data
            }
        })
    }

    return state
}
