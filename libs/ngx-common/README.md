## Table of Contents

- [Installation](#installation)
- [Directives](#directives)
- [Pipes](#pipes)
- [Services](#services)
- [Models](#models)
- [Utility Functions](#utility-functions)
- [Peer Dependencies](#peer-dependencies)

---

## Installation

```bash
npm install @touhidrahman/ngx-common
```

## Directives

### `ngxClickOutside`

Emits an event when the user clicks outside the host element.

```html
<div (clickOutside)="onClickedOutside($event)" ngxClickOutside>
    Click outside this div to trigger
</div>
```

```typescript
onClickedOutside(event: MouseEvent): void {
  console.log('Clicked outside');
}
```

---

### `ngxCopyToClipboard`

Copies the bound text to the clipboard when the element is clicked.

```html
<button [ngxCopyToClipboard]="'Text to copy'">Copy</button>
```

```typescript
// Standalone
import { CopyToClipboardDirective } from '@touhidrahman/ngx-common'
```

---

### `ngxDisableNullHref`

Prevents navigation on anchor elements when the `href` is not a valid URL.

```html
<a href="" ngxDisableNullHref>Will not navigate</a>
<a href="https://example.com" ngxDisableNullHref>Will navigate</a>
```

---

### `a[download]` (DownloadDirective)

Downloads files by fetching cross-origin URLs as blobs. Provides `loading` and `error` public properties via a template reference.

```html
<a
    download="report.pdf"
    href="https://example.com/report.pdf"
    #downloader="appDownload"
>
    Download
</a>
<span *ngIf="downloader.loading">Downloading...</span>
<span *ngIf="downloader.error">Download failed</span>
```

**Dependencies:** `HttpClient`, `DomSanitizer`

---

### `ngxHide`

Toggles `visibility: hidden` on the element (element still occupies space, unlike `*ngIf`).

```html
<div [ngxHide]="isHidden">This div hides but keeps its space</div>
```

---

### `ngxOnClickGoBack`

Navigates the browser back one step in history on click.

```html
<button ngxOnClickGoBack>Go Back</button> <a ngxOnClickGoBack>Back</a>
```

---

### `ngxRepeat` (structural directive)

Repeats the host element's content a specified number of times. Exposes the current `index` in the context.

```html
<div *ngxRepeat="5; let i = index">Item #{{ i + 1 }}</div>
```

```typescript
// Standalone
import { RepeatDirective } from '@touhidrahman/ngx-common'
```

---

### `ngxScrollable`

Adds scroll control capabilities: check overflow, scroll programmatically, and detect scroll boundaries.

```html
<div #scrollRef="ngxScrollable" ngxScrollable [scrollUnit]="200">
    <div
        *ngFor="let item of items"
        style="display: inline-block; width: 200px;"
    >
        {{ item }}
    </div>
</div>
<button (click)="scrollRef.scroll(-1)" [disabled]="!scrollRef.canScrollStart">
    Left
</button>
<button (click)="scrollRef.scroll(1)" [disabled]="!scrollRef.canScrollEnd">
    Right
</button>
```

| Property/Method     | Type   | Description                                       |
| ------------------- | ------ | ------------------------------------------------- |
| `scrollUnit`        | Input  | Pixels to scroll per `scroll()` call              |
| `isOverflow`        | Getter | Whether content overflows the container width     |
| `canScrollStart`    | Getter | Whether the user can scroll left                  |
| `canScrollEnd`      | Getter | Whether the user can scroll right                 |
| `scroll(direction)` | Method | Scrolls left (-1) or right (1) by `scrollUnit` px |

---

### `img[ngxUseFallbackImage]`

Shows a transparent 1x1 placeholder when the image source is empty or fails to load.

```html
<img [src]="user.avatarUrl" ngxUseFallbackImage />
```

## Pipes

### `bytes`

Converts a number of bytes into a human-readable format.

```typescript
{{ 2048 | bytes }}              // "2 kB"
{{ 2048 | bytes:2 }}            // "2.00 kB"
{{ 1048576 | bytes:0:'B':'MB' }} // "1 MB"
```

`bytes:decimals:fromUnit:toUnit`

---

### `ceiling`

Rounds a number up (`Math.ceil`).

```typescript
{{ 4.2 | ceiling }}  // 5
{{ -4.2 | ceiling }} // -4
```

---

### `fileSize`

Formats a byte count into a file size string with configurable unit and decimals.

```typescript
{{ 1234567 | fileSize }}          // "1.18 MB"
{{ 1234567 | fileSize:'KB':2 }}   // "1205.63 KB"
{{ 0 | fileSize }}                // "0 B"
```

`fileSize:unit:decimals` — unit is `'auto'`, `'B'`, `'KB'`, `'MB'`, `'GB'`, or `'TB'`.

---

### `filter`

Filters an array of objects by matching properties case-insensitively.

```typescript
const items = [{ name: 'John' }, { name: 'Jane' }];

{{ items | filter:{ name: 'john' } }}  // [{ name: 'John' }]
```

---

### `floor`

Rounds a number down (`Math.floor`).

```typescript
{{ 4.9 | floor }}  // 4
{{ -4.9 | floor }} // -5
```

---

### `initialName`

Returns the first character of a string, uppercased.

```typescript
{{ 'john' | initialName }} // "J"
{{ '' | initialName }}     // ""
```

---

### `isImage`

Checks if a filename has an image extension (`jpg`, `jpeg`, `png`, `gif`, `bmp`, `svg`, `webp`).

```typescript
{{ 'photo.jpg' | isImage }}     // true
{{ 'document.pdf' | isImage }}  // false
```

---

### `minimizeString`

Truncates a string to a specified length (no ellipsis).

```typescript
{{ 'Hello World' | minimizeString:5 }}  // "Hello"
```

---

### `msToTime`

Converts milliseconds to hours or minutes.

```typescript
{{ 3600000 | msToTime:'hr' }}    // "1"
{{ 60000 | msToTime:'min' }}     // "1"
```

`msToTime:format` — format is `'min'` or `'hr'`.

---

### `nl2br`

Converts newline characters to `<br/>` tags. Use with `[innerHTML]`.

```html
<div [innerHTML]="textContent | nl2br"></div>
```

---

### `range`

Generates an array of numbers from `1` to `value`, with optional start offset.

```typescript
{{ 5 | range }}        // [1, 2, 3, 4, 5]
{{ 5 | range:2 }}      // [3, 4, 5]
```

Useful for pagination:

```html
<button *ngFor="let page of totalPages | range">{{ page }}</button>
```

---

### `relativeTime`

Converts a date into a relative time string.

```typescript
{{ someDate | relativeTime }} // "just now", "5 minutes ago", "2 hours ago", "1 day ago", "recently"
```

Accepts ISO strings or `Date` objects.

---

### `safeHtml`

Bypasses sanitization to render HTML strings as trusted HTML.

```html
<div [innerHTML]="htmlContent | safeHtml"></div>
```

**Dependency:** `DomSanitizer`

---

### `safeUrl`

Trusts a URL as a resource URL (for iframes, embeds, etc.).

```html
<iframe [src]="videoUrl | safeUrl"></iframe>
```

**Dependency:** `DomSanitizer`

---

### `ellipsis`

Strips HTML tags and truncates to a character limit (default 150), appending `...` when truncated.

```typescript
{{ '<p>Long HTML content here</p>' | ellipsis:50 }}
```

---

### `showResultsText`

Generates a pagination status string.

```typescript
{{ 1 | showResultsText:10:100 }}  // "Showing 1 - 10 of 100 items"
{{ 1 | showResultsText:10:0 }}    // "No items found"
{{ 1 | showResultsText:10:1 }}    // "Showing 1 item"
```

`showResultsText:page:pageSize:totalResults`

---

### `textSlice`

Truncates a string to a character limit with ellipsis, optionally preserving whole words.

```typescript
{{ 'The quick brown fox' | textSlice:10 }}              // "The quick..."
{{ 'The quick brown fox' | textSlice:10:'..':false }}   // "The quick.."
```

`textSlice:limit:ellipsis:preserveWords` — defaults are `100`, `'...'`, `true`.

---

### `titlecase`

Capitalizes the first character of a string.

```typescript
{{ 'hello world' | titlecase }} // "Hello world"
```

---

### `unique`

Filters an array to unique values.

```typescript
{{ [1, 2, 2, 3, 3, 3] | unique }} // [1, 2, 3]
{{ ['a', 'b', 'a', 'c'] | unique }} // ['a', 'b', 'c']
```

---

### `utcDate`

Formats a date in UTC timezone using customizable format strings.

```typescript
{{ someDate | utcDate }}                // "Jun 15, 2026" (mediumDate)
{{ someDate | utcDate:'shortDate' }}    // "15/6/26"
{{ someDate | utcDate:'fullDate' }}     // "Monday, June 15, 2026"
{{ someDate | utcDate:'yyyy-MM-dd' }}   // "2026-06-15"
{{ null | utcDate }}                    // ""
```

Shortcuts: `'mediumDate'` (`MMM d, yyyy`), `'shortDate'` (`d/M/yy`), `'fullDate'` (`PPPP`).

---

### `valueIn`

Checks if a value exists in an array.

```typescript
{{ 'apple' | valueIn:['apple','banana','cherry'] }}  // true
{{ 'grape' | valueIn:['apple','banana','cherry'] }}  // false
```

---

## Services

### `ApiService<T, TCreate>`

Concrete implementation of CRUD operations using `HttpClient`.

```typescript
import { ApiService } from '@touhidrahman/ngx-common'

interface User {
    id: string
    name: string
    email: string
}
interface CreateUserDto {
    name: string
    email: string
}

@Injectable({ providedIn: 'root' })
export class UserService extends ApiService<User, CreateUserDto> {
    constructor(http: HttpClient) {
        super('/api/users', http)
    }
}
```

| Method             | HTTP   | Endpoint        |
| ------------------ | ------ | --------------- |
| `findById(id)`     | GET    | `/{id}`         |
| `find(params)`     | GET    | `?params`       |
| `search(term)`     | GET    | `?search=term`  |
| `count(params)`    | GET    | `/count?params` |
| `create(dto)`      | POST   | `/`             |
| `createMany(dtos)` | POST   | `/many`         |
| `update(id, body)` | PATCH  | `/{id}`         |
| `delete(id)`       | DELETE | `/{id}`         |
| `deleteMany(ids)`  | DELETE | `/` (body: ids) |

---

### `AbstractApiService<T, TCreate>`

Abstract base class for defining custom API service contracts.

```typescript
import { AbstractApiService } from '@touhidrahman/ngx-common'

@Injectable()
export class CustomApiService<T, TCreate> extends AbstractApiService<
    T,
    TCreate
> {
    // Must implement all abstract methods
}
```

---

### `AbstractFormService<T, TCreate>`

Bridges Angular Reactive Forms with an API service. Handles form building, population from API, and save logic (create/update).

```typescript
import { AbstractFormService } from '@touhidrahman/ngx-common'

@Injectable()
export class UserFormService extends AbstractFormService<User, CreateUserDto> {
    buildForm(): FormGroup {
        return this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        })
    }
}
```

```typescript
// In component
@Component({...})
export class UserEditComponent {
  constructor(private userFormService: UserFormService) {}

  ngOnInit(): void {
    this.userFormService.fillFormById$(userId).subscribe();
  }

  save(): void {
    this.userFormService.save$().subscribe(savedUser => {
      console.log('Saved:', savedUser);
    });
  }
}
```

| Member                   | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `form`                   | The `FormGroup` instance                                |
| `valid`                  | Whether the form is valid and touched                   |
| `getFormValue()`         | Returns raw form value as `TCreate`                     |
| `setFormValue(dto)`      | Populates form with data (adds `id` control if present) |
| `buildForm()`            | Abstract — subclass defines form structure              |
| `fillFormById$(id)`      | Fetches data from API and populates form                |
| `save$()`                | Calls `create$` or `update$` based on presence of `id`  |
| `create$(resetForm)`     | Calls `apiService.create()`                             |
| `update$(id, resetForm)` | Calls `apiService.update()`                             |

---

### `JwtService`

Wraps `@auth0/angular-jwt` to decode and validate JWT tokens.

```typescript
import { JwtService } from '@touhidrahman/ngx-common';

@Component({...})
export class AuthComponent {
  constructor(private jwt: JwtService) {}

  checkToken(token: string): void {
    const decoded = this.jwt.decodeToken<{ sub: string; role: string }>(token);
    const expired = this.jwt.isTokenExpired(token);
    const data = this.jwt.getUnexpiredDecoded<UserData>(token);
  }
}
```

---

### `LocalStorageService`

SSR-safe wrapper around `localStorage` using `@ng-web-apis/common`.

```typescript
import { LocalStorageService } from '@touhidrahman/ngx-common';

@Component({...})
export class SettingsComponent {
  constructor(private storage: LocalStorageService) {}

  saveTheme(theme: string): void {
    this.storage.setItem('theme', theme);
  }

  getTheme(): string | null {
    return this.storage.getItem('theme');
  }

  clearTheme(): void {
    this.storage.removeItem('theme');
  }
}
```

---

### `TokenSharingService`

Syncs authentication tokens between browser tabs using the `BroadcastChannel` API.

```typescript
import { TokenSharingService } from '@touhidrahman/ngx-common'

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private tokenSharing: TokenSharingService) {
        this.tokenSharing.init({
            accessTokenResolver: () => this.getAccessToken(),
            refreshTokenResolver: () => this.getRefreshToken(),
            accessTokenSaver: (token) => this.setAccessToken(token),
            refreshTokenSaver: (token) => this.setRefreshToken(token),
        })
    }
}
```

When a new tab opens, it requests tokens from existing tabs. Any tab receiving new tokens saves them via the provided saver functions.

---

## Models

### `ApiResponse<T>`

Generic wrapper for standardized API responses.

```typescript
import { ApiResponse } from '@touhidrahman/ngx-common'

interface ApiResponse<T> {
    data: T
    meta?: Record<string, unknown>
    pagination?: {
        totalPages?: number
        totalItems?: number
        page?: number
        size?: number
    }
    error?: unknown
    message?: string
    success?: boolean
}
```

Used by `ApiService` and its consumers:

```typescript
this.userService
    .find({ page: 1 })
    .subscribe((response: ApiResponse<User[]>) => {
        const users = response.data
        const totalItems = response.pagination?.totalItems
    })
```

---

### `LabelValuePair<T>`

Generic key-value pair for dropdown options and select inputs.

```typescript
import { LabelValuePair } from '@touhidrahman/ngx-common'

const options: LabelValuePair<string>[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
]
```

```html
<select>
    <option *ngFor="let opt of options" [value]="opt.value">
        {{ opt.label }}
    </option>
</select>
```

---

## Utility Functions

### `addPhonePrefix`

Prepends a given prefix to a string if it is not an email and does not already have the prefix.

```typescript
import { addPhonePrefix } from '@touhidrahman/ngx-common'

addPhonePrefix('1712345678', '+88') // '+881712345678'
addPhonePrefix('user@example.com', '+88') // 'user@example.com'
```

`addPhonePrefix(input, prefix)` — `prefix` is prepended only when the value is not an email and doesn't already start with `prefix`.

---

### File Handling Utilities (`download`, `getHashedFileName`, `getFileExtension`, `getFileNameFromUrl`, `getFileType`, `getMimeType`)

```typescript
import {
    download,
    getHashedFileName,
    getFileExtension,
    getFileNameFromUrl,
    getFileType,
    getMimeType,
} from '@touhidrahman/ngx-common'

// Trigger a file download
download('report.pdf', pdfBlob)

// Generate a unique filename
const hashed = getHashedFileName(file) // "550e8400-....pdf"

// Extract extension from a File object
const ext = getFileExtension(file) // "pdf"

// Get filename from URL
const name = getFileNameFromUrl('https://example.com/files/doc.pdf') // "doc.pdf"

// Categorize file type
const type = getFileType(file) // "image" | "document" | "audio" | "video"

// Get MIME type from path
const mime = getMimeType('photo.jpg') // "image/jpeg"
```

---

### `markAllControlsAsDirty`

Recursively marks all controls in a form as dirty and touched.

```typescript
import { markAllControlsAsDirty } from '@touhidrahman/ngx-common'

markAllControlsAsDirty([myForm])
```

---

### `isFutureDate`

Checks if a date is in the future (compared from start of day).

```typescript
import { isFutureDate } from '@touhidrahman/ngx-common'

isFutureDate('2026-12-25') // true (if today is before Dec 25, 2026)
isFutureDate('2020-01-01') // false
```

---

### `toHttpParams`

Converts a plain object to Angular `HttpParams`, handling arrays by appending multiple values. Null/undefined values are skipped.

```typescript
import { toHttpParams } from '@touhidrahman/ngx-common'

const params = toHttpParams({
    page: 1,
    size: 20,
    tags: ['angular', 'typescript'],
})
// URL: ?page=1&size=20&tags=angular&tags=typescript
```

---

### `integerValidator`

Returns an Angular validator that checks if a form control value is an integer.

```typescript
import { integerValidator } from '@touhidrahman/ngx-common'

this.fb.control('', [integerValidator()])
// Returns { integer: true } on validation failure
```

---

### `maskString`

Masks the middle portion of a string, keeping visible characters at the beginning and end.

```typescript
import { maskString } from '@touhidrahman/ngx-common'

maskString('1234567890', 2, 2) // "12******90"
maskString('hello@example.com', 3, 4) // "hel***********mail"
```

`maskString(input, visibleCharsHead, visibleCharsTail)`

---

### `toFormData`

Recursively converts an object to `FormData`, handling nested objects (bracket notation), arrays, Dates, Files, and Blobs.

```typescript
import { toFormData } from '@touhidrahman/ngx-common'

const data = {
    name: 'John',
    avatar: fileInput.files[0],
    tags: ['dev', 'angular'],
    metadata: { version: 1 },
}

const formData = toFormData(data)
// formData entries:
//   name -> "John"
//   avatar -> File
//   tags[0] -> "dev"
//   tags[1] -> "angular"
//   metadata[version] -> "1"
```

Useful for file uploads with complex nested payloads.

---

## Peer Dependencies

The following packages are required by your application when using this library:

| Package                   | Used By                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `@angular/common` ^21.1.0 | Core dependency                                                     |
| `@angular/core` ^21.1.0   | Core dependency                                                     |
| `@angular/forms`          | `AbstractFormService`, `integerValidator`, `markAllControlsAsDirty` |
| `@angular/router`         | `Params` type in services                                           |
| `@auth0/angular-jwt`      | `JwtService`                                                        |
| `@ng-web-apis/common`     | `LocalStorageService`                                               |
| `date-fns`                | `UtcDatePipe`, `RelativeTimePipe`, `isFutureDate`                   |
| `date-fns-tz`             | `UtcDatePipe`                                                       |
| `es-toolkit`              | `TitlecasePipe`, `UniquePipe`, `UtcDatePipe`                        |
