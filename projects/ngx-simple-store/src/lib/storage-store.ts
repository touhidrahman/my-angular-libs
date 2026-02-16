import { destr } from 'destr'
import { serializeObject } from '@touhidrahman/simple-store'

export class StorageStore<T> {
    private storage: Storage

    constructor(
        private key: string,
        private initialState?: T,
        storage?: Storage,
    ) {
        this.storage = storage || localStorage
        if (!this.storage?.getItem(this.key)) {
            this.setState(this.initialState || {})
        }
    }

    setState(value: Partial<T>, sideEffectFn?: () => void): void {
        this.storage?.setItem(this.key, serializeObject({ ...this.getState(), ...value }, false))
        sideEffectFn?.()
    }

    getState(): T {
        return destr<T>(this.storage?.getItem(this.key))
    }

    select<K extends keyof T>(key: K): T[K] {
        return this.getState()[key]
    }

    destroy(): void {
        this.storage?.removeItem(this.key)
    }
}
