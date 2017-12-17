import * as utils from './utils';
import { AvailableProperties } from './events';
import { $Cache, dispatch } from './delegate';

type PartialEvent = Partial<AvailableProperties>;

/**
 * create a native event object
 * @param {PartialEvent} option
 * @returns {Event}
 */
function createEvent(type: string, option: PartialEvent) {
    // default all mock events allow cancellation, allow bubbling
    const opts = {
        bubbles: true,
        cancelable: true,
        ...option,
    };

    let evt;
    if (/^mouse(?!wheel)|click/i.test(type)) {
        evt = new MouseEvent(type, opts);
    }
    else if (/^key/i.test(type)) {
        evt = new KeyboardEvent(type, opts);
    }
    else {
        evt = new Event(type, opts);
    }

    return (evt);
}

/**
 * triggers a delegate event
 * @param {HTMLElement} elem
 * @param {string} name
 * @param {PartialEvent} [opts={}]
 */
export function triggerDelegateEvent(elem: HTMLElement, type: string, opts: PartialEvent = {}) {
    if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
    }

    const html = document.body.parentElement as HTMLElement;
    const path: HTMLElement[] = [];

    for (let i = elem; !utils.isNull(i.parentElement); i = i.parentElement) {
        if ($Cache.has(i)) {
            path.push(i);
        }
    }

    $Cache.has(html) && path.push(html);
    path.reverse();

    // create native event
    const nativeEvent = createEvent(type, opts);
    Object.defineProperty(nativeEvent, 'target', { value: elem, enumerable: true });
    Object.defineProperty(nativeEvent, 'currentTarget', { value: elem, enumerable: true });

    // capturing phase
    Object.defineProperty(nativeEvent, 'eventPhase', { value: 1, enumerable: true, writable: true });
    path.forEach((dom) => dispatch(dom, nativeEvent));

    path.reverse();

    // bubbling phase
    Object.defineProperty(nativeEvent, 'eventPhase', { value: 3, enumerable: true, writable: true });
    path.forEach((dom) => dispatch(dom, nativeEvent));
}

/**
 * triggers a native event
 *  - the event of the delegate is also triggered during the execution of the event stream
 * @param {HTMLElement} elem
 * @param {string} name
 * @param {PartialEvent} [opts={}]
 */
export function triggerEvent(elem: HTMLElement, type: string, opts: PartialEvent = {}) {
    if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
    }

    const evt = createEvent(type, opts);
    elem.dispatchEvent(evt);
}
