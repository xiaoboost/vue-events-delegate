import * as utils from './utils';

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value<T>(this: T[], searchElement: T, fromIndex?: number): boolean {
            if (utils.isNull(this)) {
                throw new TypeError('"this" is null or not defined');
            }

            const o = Object(this) as T[];
            const len = o.length >>> 0;

            if (len === 0) {
                return false;
            }

            const n = (fromIndex as number) | 0;
            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            while (k < len) {
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }
            return false;
        },
    });
}
