export function toFormData(obj: unknown): FormData {
    const formData = new FormData()

    function appendFormData(data: any, parentKey?: string) {
        if (data == null) return

        if (data instanceof File || data instanceof Blob) {
            formData.append(parentKey!, data)
            return
        }

        if (data instanceof Date) {
            formData.append(parentKey!, data.toISOString())
            return
        }

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                appendFormData(item, `${parentKey}[${index}]`)
            })
            return
        }

        if (typeof data === 'object') {
            for (const key in data) {
                const value = data[key]
                const newKey = parentKey ? `${parentKey}[${key}]` : key
                appendFormData(value, newKey)
            }
            return
        }

        formData.append(parentKey!, String(data))
    }

    appendFormData(obj)
    return formData
}
