import { Signal, signal, WritableSignal } from '@angular/core';
import { isEqual, isNotNil } from 'es-toolkit';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { Observable, take, timer } from 'rxjs';
import { removeOldestEntry, serializeObject } from '@touhidrahman/simple-store';

export interface SimpleSignalStoreState<Q, R, T> {
  query: Q;
  result: R;
  transient: T;
}

export interface SimpleSignalStoreConfig {
  cacheEnabled?: boolean;
  cacheLimit?: number;
  debounceTime?: number;
}

const DEFAULT_CACHE_LIMIT = 100;
const DEFAULT_DEBOUNCE_TIME = 100;

export abstract class SimpleSignalStore<
  Q extends Record<string, any>,
  R extends Record<string, any>,
  T extends Record<string, any>,
> {
  private cache: Map<string, R> = new Map();
  private initialState: SimpleSignalStoreState<Q, R, T>;
  private _query: WritableSignal<Q>;
  private _result: WritableSignal<R>;
  private _transient: WritableSignal<T>;
  private activeDebounceTime = -1;
  private waitingQuery: Q | null = null;

  protected debounceTime: number;
  protected cacheEnabled = signal(false);
  protected cacheLimit: number;

  active = signal(false);

  get query(): Signal<Q> {
    return this._query.asReadonly();
  }

  get result(): Signal<R> {
    return this._result.asReadonly();
  }

  get transient(): Signal<T> {
    return this._transient.asReadonly();
  }

  constructor(initialState: SimpleSignalStoreState<Q, R, T>, config?: SimpleSignalStoreConfig) {
    this.initialState = initialState;
    this._query = signal(initialState.query);
    this._result = signal(initialState.result);
    this._transient = signal(initialState.transient);
    this.cacheEnabled.set(config?.cacheEnabled ?? false);
    this.cacheLimit = config?.cacheLimit ?? DEFAULT_CACHE_LIMIT;
    this.debounceTime = config?.debounceTime ?? DEFAULT_DEBOUNCE_TIME;

    explicitEffect(
      [this.active, this.query, this.cacheEnabled],
      ([active, query, cacheEnabled], cleanup) => {
        if (!active) return;

        if (cacheEnabled) {
          const cached = this.getCachedResult(query);
          if (isNotNil(cached)) {
            this._result.set(cached);
            return;
          }
        }

        const result = this.onChangeQuery(query);
        this.resultSetter(result, cleanup);
      },
      { defer: false },
    );

    effectOnceIf(
      () => this.active(),
      () => this.runOnceAfterStart(),
    );
  }

  start(delay = 0) {
    if (delay > 0) {
      timer(delay)
        .pipe(take(1))
        .subscribe(() => this.active.set(true));
    } else {
      this.active.set(true);
    }
  }

  stop() {
    this.active.set(false);
  }

  clearCache() {
    this.cache.clear();
  }

  reset() {
    this.clearCache();
    this.waitingQuery = null;
    this.activeDebounceTime = -1;
    this.setQuery(this.initialState.query);
    this.setResult(this.initialState.result);
    this.setTransient(this.initialState.transient);
  }

  protected abstract onChangeQuery(
    query: Q,
  ): Observable<Partial<R>> | Signal<Partial<R>> | Partial<R>;

  protected abstract runOnceAfterStart(): void;

  setQuery(query: Partial<Q>, debounceTime = 0) {
    const newQuery = { ...this.query(), ...query };
    if (isEqual(newQuery, this.query())) return;

    this.waitingQuery = newQuery;
    if (this.activeDebounceTime > -1) return;

    this.activeDebounceTime = this.debounceTime > debounceTime ? this.debounceTime : debounceTime;

    timer(this.activeDebounceTime)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.activeDebounceTime = -1;
          if (!this.waitingQuery) return;
          this._query.set(this.waitingQuery);
          this.waitingQuery = null;
        },
      });
  }

  setResult(result: Partial<R>) {
    const newResult = { ...this.result(), ...result };
    this.cacheResult(newResult);
    this._result.set(newResult);
  }

  setTransient(transient: Partial<T>) {
    this._transient.set({ ...this.transient(), ...transient });
  }

  private getCachedResult(query: Q): R | undefined {
    if (!this.cacheEnabled) return undefined;

    const key = this.getCacheKey(query);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return undefined;
  }

  private cacheResult(result: R) {
    if (!this.cacheEnabled) return;
    if (this.cache.size >= Math.abs(this.cacheLimit)) {
      removeOldestEntry(this.cache);
    }
    this.cache.set(this.getCacheKey(this.query()), result);
  }

  private resultSetter(
    result: Observable<Partial<R>> | Signal<Partial<R>> | Partial<R>,
    cleanup?: (callback: () => void) => void,
  ) {
    if (result instanceof Observable) {
      const subscription = result.subscribe({
        next: (r) => this.setResult(r),
      });
      if (cleanup) cleanup(() => subscription.unsubscribe());
    } else if (typeof result === 'function') {
      this.setResult(result());
    } else {
      this.setResult(result);
    }
  }

  private getCacheKey(query: Q): string {
    return serializeObject(query, true);
  }
}
