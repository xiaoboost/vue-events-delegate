/**
 * Is x a number
 * @param {*} x
 * @returns {x is number}
 */
export function isNumber(x: any): x is number {
    return (typeof x === 'number');
}

/**
 * Is x a string
 * @param {*} x
 * @returns {x is string}
 */
export function isString(x: any): x is string {
    return (typeof x === 'string');
}

/**
 * Is x a null or undefined
 * @param {*} x
 * @returns {(x is null | undefined)}
 */
export function isNull(x: any): x is null | undefined {
    const type = Object.prototype.toString.call(x) as string;
    return (type === '[object Null]' || type === '[object Undefined]');
}

/**
 * Is x a array
 *  - contains class that inherited array
 *
 * @param {*} x
 * @returns {x is any}
 */
export function isArray<T>(x: any): x is T[] {
    return (Object.prototype.toString.call(x) === '[object Array]');
}
