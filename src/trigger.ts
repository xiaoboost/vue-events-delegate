import * as utils from './utils';
import { $Cache, dispatch } from './delegate';

type InputProps =
    'bubbles' | 'cancelable' | 'button' | 'buttons' | 'clientX' | 'clientY' |
    'screenX' | 'screenY' | 'deltaX' | 'deltaY' | 'deltaZ' | 'deltaMode' | 'altKey' |
    'code' | 'ctrlKey' | 'key' | 'location' | 'metaKey' | 'repeat' | 'shiftKey';

type AllEvent = Event & MouseEvent & KeyboardEvent & WheelEvent;
type PartialEvent = Partial<{ [key in InputProps]: AllEvent[key] } & { capture: boolean }>;

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
 * set property value for event object
 * @param {Event} evt
 * @param {string} property
 * @param {*} value
 */
function setEventProperty(evt: Event, property: string, value: any) {
    Object.defineProperty(evt, property, { value, enumerable: true, writable: true });
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

    // event phase
    const capture = opts.capture ? 1 : 3;
    delete opts.capture;

    // assembly delegete dom path
    const html = document.body.parentElement as HTMLElement;
    const path: HTMLElement[] = [];

    for (let i = elem; !utils.isNull(i.parentElement); i = i.parentElement) {
        if ($Cache.has(i)) {
            path.push(i);
        }
    }

    $Cache.has(html) && path.push(html);

    // create native event
    const nativeEvent = createEvent(type, opts);
    setEventProperty(nativeEvent, 'target', elem);
    setEventProperty(nativeEvent, 'eventPhase', capture);

    if (capture === 1) {
        path.reverse();
    }

    path.forEach((dom) => {
        setEventProperty(nativeEvent, 'currentTarget', dom);
        // FIXME: Is it really possible to use the dispatch function directly here?
        dispatch(dom, nativeEvent);
    });
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
