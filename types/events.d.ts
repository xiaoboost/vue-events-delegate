/** Interface of the delegate extension event of the W3C event object */
export interface BaseDelegateEvent extends Event {
    /** The browser's original Event object. */
    _originalEvent: Event;

    /** The current DOM element within the event bubbling phase. */
    currentTarget: HTMLElement;
    /** The element where the currently-called Delegate event handler was attached. */
    delegateTarget: HTMLElement;
    /** The DOM element that initiated the event. */
    target: HTMLElement;

    /** whether event.preventDefault() was ever called on this event object. */
    isDefaultPrevented: boolean;
    /** whether event.stopImmediatePropagation() was ever called on this event object. */
    isImmediatePropagationStopped: boolean;
    /** whether event.stopPropagation() was ever called on this event object. */
    isPropagationStopped: boolean;

    /** The other DOM element involved in the event, if any. */
    // TODO: 存疑
    relatedTarget: HTMLElement;
    /** The last value returned by an event handler that was triggered by this event, unless the value was undefined. */
    result: any;

    /** Keeps the rest of the handlers from being executed and prevents the event from bubbling up the DOM tree. */
    stopImmediatePropagation(): void;
    /** Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event. */
    stopPropagation(): void;
    /** If this method is called, the default action of the event will not be triggered. */
    preventDefault(): void;
}

export interface DelegateWheelEvent extends BaseDelegateEvent {
    deltaX: number,
    deltaY: number,
    deltaZ: number,
    deltaMode: number,
}

export interface DelegateMouseEvent extends BaseDelegateEvent {
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    movementX: number;
    movementY: number;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
    x: number;
    y: number;
}

export interface DelegateKeyEvent extends BaseDelegateEvent {
    altKey: boolean;
    code: string;
    ctrlKey: boolean;
    key: string;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
}

export interface DelegateEvent extends
    BaseDelegateEvent,
    DelegateWheelEvent,
    DelegateMouseEvent,
    DelegateKeyEvent {}

export type DelegateCallback = (e: DelegateEvent) => any;
