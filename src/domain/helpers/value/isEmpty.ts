export function isEmpty(value: any): boolean {
    if (value === null || typeof value === 'undefined') {
        return true;
    }

    if (typeof value == 'number') {
        return !value && value != 0;
    }

    if (typeof value == 'object') {
        return Object.keys(value).length == 0;
    }

    if (Array.isArray(value)) {
        return value.length == 0;
    }

    return !value;
}
