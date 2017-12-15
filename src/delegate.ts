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
    environment: HandlerObj;
}

interface HandlerObj {
    type: string;
    selector: string;
    capture: boolean;
    matches: Element[];
    characteristic: SelectorParsed[];
    callback(e: $Event): any;
}

interface EventsObj {
    [x: string]: HandlerObj[];
}

/** Delegate Data Global Cache */
const $Cache = new Map<HTMLElement, ElementData>();

/** Fix Some Special Event */
const special: { [x: string]: (e: Event) => boolean } = {
    mouseenter: (event) => event.currentTarget === event.target,
    mouseleave: (event) => event.currentTarget === event.target,
};

/**
 * Parse the selector
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

// 根据选择器匹配被选中的 DOM
function isContains(delegate: HTMLElement, elem: HTMLElement, handler: HandleObj) {
    // 选择器缓存中含有被测试 DOM
    if (handler.matches.includes(elem)) {
        return (true);
    }

    // 当前 DOM 元素属性
    const elemTag = elem.tagName.toLowerCase(),
        elemId = elem.getAttribute('id'),
        elemClass = elem.classList;

    // 匹配选择器
    if (handler.characteristic.every((selector) =>
        (selector.tag && selector.tag !== elemTag) ||
        (selector.id && selector.id !== elemId) ||
        (selector.class && !selector.class.every((n) => elemClass.contains(n))),
    )) {
        return (false);
    }

    // 重置选择器选择器件，并再次匹配
    handler.matches = Array.from(delegate.querySelectorAll(handler.selector));
    return handler.matches.includes(elem);
}

/**
 * Wraps the callback function that satisfies the condition into a queue along the event path
 * @param {HTMLElement} elem
 * @param {$Event} event
 * @param {boolean} capture
 * @param {HandlerObj[]} handlers
 * @returns {HandlerQueueObj[]}
 */
function tohandlers(elem: HTMLElement, event: $Event, handlers: HandlerObj[]): HandlerQueueObj[] {
    // 组成路径
    const path: HTMLElement[] = [];
    for (let i = event.target; i !== event.currentTarget && i.parentElement; i = i.parentElement) {
        path.push(i);
    }
    path.push(event.currentTarget);
    path.reverse();

    // 委托元素本身的事件
    const handlerQueue: HandlerQueueObj[] = handlers
        .filter((n) => !n.selector)
        .map((n) => ({ element: elem, environment: n }));

    // 沿着委托元素向下
    for (let i = path.length - 1; i >= 0; i--) {
        // 若节点不是 Node.ELEMENT_NODE，则跳过
        if (path[i].nodeType !== 1) {
            continue;
        }

        handlerQueue.push(
            ...handlers
                .filter((n) => n.selector && isContains(elem, path[i], n))
                .map((n) => ({ element: path[i], environment: n })),
        );
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

    debugger;
    event.delegateTarget = elem;
    const handlerQueue = tohandlers(elem, event, elemhandlers);

    handlerQueue.some((handlerObj: HandlerQueueObj) => {
        const fn = handlerObj.environment.callback;

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
    // Get data of current dom
    let elemData = $Cache.get(elem) as ElementData;
    // If there is no data, then create
    if (utils.isNull(elemData)) {
        elemData = {
            events: {},
            handler: (event: Event): void => dispatch(elem, event),
        };
        $Cache.set(elem, elemData);
    }

    const events = elemData.events;

    // Split events and bind
    (types.match(/\S+/g) || ['']).forEach((type) => {
        if (!type) {
            return;
        }

        // Ceate handler object
        const handlerObj: HandlerObj = {
            type,
            callback,
            selector,
            capture,
            characteristic: paserSelector(selector),
            matches: selector ? Array.from(elem.querySelectorAll(selector)) : [],
        };

        // If this event is defined first time
        if (!events[type]) {
            events[type] = [];
            // bind the origin event
            elem.addEventListener(type, elemData.handler, capture);
        }

        // If there have duplicates selector, then cover it; no duplicates, then add to the end
        if (!(events[type].some((n, i, arr) => (selector === n.selector) && (Boolean(arr[i] = handlerObj))))) {
            events[type].push(handlerObj);
        }
    });
}

/**
 * Remove the delegate event
 * @param {object} elem
 * @param {string} types
 * @param {string} selector
 * @param {$Callback} callback
 * @param {boolean} [capture]
 */
export function remove(elem: HTMLElement, types?: string, selector?: string, fn?: $Callback, capture: boolean = false): void {

}
