import * as utils from './utils';
import { $Event, $Callback } from './events';

interface SelectorParsed {
    tag: string;
    id: string;
    class: string[];
}

interface ElementData {
    events: EventsObj;
    handler(e: Event): void;
}

interface HandlerQueueObj {
    element: HTMLElement;
    environment: HandlerEnv;
}

interface HandlerEnv {
    type: string;
    selector: string;
    capture: boolean;
    matches: Element[];
    characteristic: SelectorParsed[];
    callback(e: $Event): any;
}

interface EventsObj {
    [x: string]: {
        data: HandlerEnv[];
        capture: boolean;
        bubble: boolean;
    };
}

/** delegate Data Global Cache */
const $Cache = new Map<HTMLElement, ElementData>();

/** fix Some Special Event */
const special: { [x: string]: (e: Event) => boolean } = {
    mouseenter: (event) => event.currentTarget === event.target,
    mouseleave: (event) => event.currentTarget === event.target,
};

/**
 * creates an array from an array-like object.
 * @template T
 * @param {ArrayLike<T>} arrayLike
 * @returns {T[]}
 */
function arrayFrom<T>(arrayLike: ArrayLike<T>): T[] {
    return Array.prototype.slice.call(arrayLike) as T[];
}

/**
 * parse the selector
 * @param {string} all
 * @returns {SelectorParsed[]}
 */
function paserSelector(all: string): SelectorParsed[] {
    return all
        .split(',')
        .map((str) => {
            const selector = str.trim().split(' ').pop();

            if (utils.isNull(selector)) {
                return false;
            }

            const tagMatch = /^[a-z]+/.exec(selector);
            const idMatch = /#([^.#]+)/.exec(selector);
            const classMatch = selector.match(/\.[^.#]+/g);

            return {
                id: utils.isNull(idMatch) ? '' : idMatch[1],
                tag: utils.isNull(tagMatch) ? '' : tagMatch[1],
                class: (classMatch || []).filter(Boolean).map((n) => n.substr(1)),
            };
        })
        .filter((selector): selector is SelectorParsed => !!selector);
}

/**
 * match dom
 * @param {HTMLElement} delegate
 * @param {HTMLElement} elem
 * @param {HandlerEnv} handler
 * @returns {boolean}
 */
function isContains(delegate: HTMLElement, elem: HTMLElement, handler: HandlerEnv): boolean {
    // dom has been in selector cache
    if (handler.matches.includes(elem)) {
        return (true);
    }

    //  the tag, id, class of test dom
    const elemTag = elem.tagName.toLowerCase(),
        elemId = elem.getAttribute('id'),
        elemClass = elem.classList;

    // match selector
    if (handler.characteristic.every((selector) =>
        (selector.tag && selector.tag !== elemTag) ||
        (selector.id && selector.id !== elemId) ||
        (selector.class && !selector.class.every((n) => elemClass.contains(n))),
    )) {
        return (false);
    }

    // call querySelectorAll and match again
    handler.matches = arrayFrom(delegate.querySelectorAll(handler.selector));
    return handler.matches.includes(elem);
}

/**
 * Wraps the callback function that satisfies the condition into a queue along the event path
 * @param {$Event} event
 * @param {boolean} capture
 * @param {HandlerObj[]} handlers
 * @returns {HandlerQueueObj[]}
 */
function tohandlers(event: $Event, handlers: HandlerEnv[]): HandlerQueueObj[] {
    // event.currentTarget is delegate dom
    const elem = event.currentTarget;
    // is phase of event the capture at now
    const capture = (event.eventPhase === 1);

    // create path, from target to elem
    const path: HTMLElement[] = [];
    for (let i = event.target; i !== elem && i.parentElement; i = i.parentElement) {
        path.push(i);
    }
    path.push(elem);

    // check events along the path
    const handlerQueue: HandlerQueueObj[] = [];
    for (const dom of path) {
        // the type of node must be  Node.ELEMENT_NODE or Node.DOCUMENT_NODE
        if (dom.nodeType !== 1 && dom.nodeType !== 9) {
            continue;
        }

        handlerQueue.push(
            ...handlers
                .filter((n) => n.selector && n.capture === capture && isContains(elem, dom, n))
                .map((n) => ({ element: dom, environment: n })),
        );
    }

    // if phase of event is capture, then reverse queue of handler
    if (capture) {
        handlerQueue.reverse();
    }

    return handlerQueue;
}

/**
 * Dispatch the delegate event
 * @param {HTMLElement} elem
 * @param {Event} args
 */
function dispatch(elem: HTMLElement, origin: Event): void {
    const event = new $Event(origin);
    const elemData = $Cache.get(elem);
    const elemEvents = elemData && elemData.events;
    const elemhandlers = elemEvents && elemEvents[origin.type];

    if (!elemhandlers) {
        throw new Error('This Element does not bind events');
    }

    event.delegateTarget = elem;
    const handlerQueue = tohandlers(event, elemhandlers.data);

    handlerQueue.some((handlerObj: HandlerQueueObj) => {
        const fn = handlerObj.environment.callback;

        // TODO: relatedTarget
        event.currentTarget = handlerObj.element;
        event.type = handlerObj.environment.type;

        // check the special event
        if (special[event.type] && !(special[event.type])(origin)) {
            return (false);
        }

        // run callback
        const ret = fn(event);
        // if the call return false
        if (ret === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        // if isPropagationStopped is true, then stop all subsequent callbacks
        return (event.isPropagationStopped);
    });
}

/**
 * Add the delegate event
 * @param {HTMLElement} elem
 * @param {string} types
 * @param {string} selector
 * @param {$Callback} callback
 * @param {boolean} [capture]
 */
export function add(elem: HTMLElement, types: string, selector: string, callback: $Callback, capture: boolean = false): void {
    // get data of current dom
    let elemData = $Cache.get(elem) as ElementData;

    // if there is no data, then create
    if (utils.isNull(elemData)) {
        elemData = {
            events: {},
            handler: (event: Event): void => dispatch(elem, event),
        };
        $Cache.set(elem, elemData);
    }

    const events = elemData.events;

    // split events and bind
    (types.match(/\S+/g) || []).forEach((type) => {
        if (!type) {
            return;
        }

        // create handler object
        const handlerEnv: HandlerEnv = {
            type, callback, selector, capture,
            characteristic: paserSelector(selector),
            matches: selector ? arrayFrom(elem.querySelectorAll(selector)) : [],
        };

        // if this event is defined first time
        if (!events[type]) {
            events[type] = {
                data: [],
                bubble: false,
                capture: false,
            };
        }

        const typeData = events[type];

        // if there have duplicates selector, then cover it; otherwise add it to the end
        if (typeData.data.every((handler, i, arr) =>
            (selector === handler.selector && capture === handler.capture)
                ? (arr[i] = handlerEnv, false)
                : true,
        )) {
            typeData.data.push(handlerEnv);
        }

        // bind the origin event
        if (!typeData.capture && capture) {
            elem.addEventListener(type, elemData.handler, true);
            typeData.capture = true;
        }
        if (!typeData.bubble && !capture) {
            elem.addEventListener(type, elemData.handler, false);
            typeData.bubble = true;
        }
    });
}

/**
 * Remove the delegate event
 * @param {object} elem
 * @param {string} [types]
 * @param {string} [selector]
 * @param {($Callback | false)} [callback]
 */
export function remove(elem: HTMLElement, types: string = '', selector: string = '*', fn: $Callback | false = false): void {
    const elemData = $Cache.get(elem);
    const events = elemData && elemData.events;

    // no data, return;
    if (!elemData || !events) {
        return;
    }

    // split event type
    let typeArr = types.match(/\S+/g);

    // type is none, delete all types data
    if (!typeArr) {
        typeArr = Object.keys(events);
    }

    typeArr.forEach((type) => {
        const typeData = events[type];

        typeData.data = typeData.data.filter((handlerObj) => {
            if (
                (selector === '*' && !fn) ||
                (selector === handlerObj.selector && !fn) ||
                (selector === '*' && fn === handlerObj.callback) ||
                (selector === handlerObj.selector && fn === handlerObj.callback)
            ) {
                return (false);
            }

            return (true);
        });

        // there is no delegate bubble event
        if (typeData.bubble && typeData.data.every((handler) => handler.capture)) {
            elem.removeEventListener(type, elemData.handler, false);
            typeData.bubble = false;
        }
        // there is no delegate capture event
        if (typeData.capture && typeData.data.every((handler) => !handler.capture)) {
            elem.removeEventListener(type, elemData.handler, true);
            typeData.capture = false;
        }

        // no delegate event in this type
        if (typeData.data.length === 0) {
            delete events[type];
        }

        // there is no detegate in elem
        if (Object.keys(events).length === 0) {
            $Cache.delete(elem);
        }
    });
}
