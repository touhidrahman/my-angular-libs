# NGX Simple Store

## Overview
Lightweight RxJS-based state utilities for TypeScript:

- `SimpleSignalStore<Q,R,T>`: Manage `query`, `result`, and `transient` with cache by query, using Angular signals.
- `StorageStore<T extends Record<string, unknown>>`: Wrapper for `localStorage` or `sessionStorage` with basic checks.
- `StorageSignal<T extends Record<string, unknown>>`: Signal wrapper for `Storage` with cross-tab sync.

This library builds on top of `@touhidrahman/simple-store` to provide Angular specific implementation. Underlying library includes:
- `StateSubject<T>`: Deep-equality BehaviorSubject with reset. Only emits if a value has truly changed.
- `SimpleStore<T extends Record<string, unknown>>`: Keyed selection and immutable partial updates.
- `QueryResultStore<Q,R,T>`: Manage `query`, `result`, and `transient` with cache by query.

### Peer deps
- `rxjs`
- `es-toolkit`
- `ngxtension`
- `@touhidrahman/simple-store`

## Quick Start

### SimpleSignalStore
Manage `query`, `result`, and `transient` with cache by query.

```typescript
import { SimpleSignalStore } from 'simple-store'

@Injectable({
    providedIn: 'root',
})
export class OperationStore extends SimpleSignalStore<
    { search: string, page: number, size: number },
    { operations: Operation[] },
    { loading: boolean }
> {
    operationApiService = inject(OperationApiService)

    constructor() {
        super({
            query: { search: '', page: 1, size: 20 },
            result: { operations: [] },
            transient: { loading: false },
        }, {
			cacheLimit: 10,
			debounceTime: 500,
			cacheEnabled: true,
		})
        this.start()
    }

    protected override onChangeQuery(query: { search: string, page: number, size: number }) {
        return this.operationApiService.getOperations(query).pipe(
            map((data) => ({ operations: data })),
            catchError((error) => of({ operations: [] })),
        )
    }

    protected override runOnceAfterStart() {}
}
```

Use it in component:

```typescript
export class SomeComponent {
    store = inject(OperationStore)

    constructor() {
        this.store.setQuery({ search: 'books' })
    }
}
```

```html
@let query = store.query()
@let loading = store.transient().loading
@let operations = store.result().operations

<div *ngIf="operations.length">
    <div *ngFor="let operation of operations">
        {{ operation.name }}
    </div>
</div>
```

## API Reference

- **`SimpleSignalStore<Q,R,T>`:**
	- **signals:** `query()`, `result()`, `transient()`.
	- **getters/setters:** `setQuery`, `getQuery`, `setResult`, `getResult`, `setTransient`, `getTransient`.
	- **cache:** `cacheLimit`, `debounceTime`, `cacheEnabled`.
	- **methods:** `runOnceAfterStart()`, `onChangeQuery(query)`

## License
MIT
