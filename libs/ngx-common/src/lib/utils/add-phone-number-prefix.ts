export function addPhonePrefix(input: string, prefix: string): string {
    const value = input.trim().toLowerCase() || ''
    if (value && !value.includes('@') && !value.startsWith(prefix)) {
        return `${prefix}${value}`
    }
    return value
}
