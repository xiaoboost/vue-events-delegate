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
 * Is x a boolean
 * @param {*} x
 * @returns {x is boolean}
 */
export function isBoolean(x: any): x is boolean {
    return (typeof x === 'boolean');
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
 * Is x a function
 * @param {*} x
 * @returns {x is () => any}
 */
/* tslint:disable-next-line:ban-types  */
export function isFunction(x: any): x is Function {
    return (typeof x === 'function');
}
