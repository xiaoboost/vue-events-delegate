/** Interface of the delegate extension event of the W3C event object */
export interface BaseDelegateEvent extends Event {
    /** The browser's original Event object. */
    _originalEvent: Event;

    /** The current DOM element within the event bubbling phase. */
    currentTarget: Element;
    /** The element where the currently-called Delegate event handler was attached. */
    delegateTarget: Element;
    /** The DOM element that initiated the event. */
    target: Element;

    /** whether event.preventDefault() was ever called on this event object. */
    isDefaultPrevented: boolean;
    /** whether event.stopImmediatePropagation() was ever called on this event object. */
    isImmediatePropagationStopped: boolean;
    /** whether event.stopPropagation() was ever called on this event object. */
    isPropagationStopped: boolean;

    /** The other DOM element involved in the event, if any. */
    relatedTarget: Element;
    /** The last value returned by an event handler that was triggered by this event, unless the value was undefined. */
    result: any;

    /** Keeps the rest of the handlers from being executed and prevents the event from bubbling up the DOM tree. */
    stopImmediatePropagation(): void;
    /** Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event. */
    stopPropagation(): void;
    /** If this method is called, the default action of the event will not be triggered. */
    preventDefault(): void;
}

export interface DelegateInputEvent extends BaseDelegateEvent {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export interface DelegateMouseEvent extends DelegateInputEvent {
    button: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
}

export interface DelegateKeyEvent extends DelegateInputEvent {
    char: any;
    charCode: number;
    key: any;
    keyCode: number;
}

export interface DelegateEvent extends BaseDelegateEvent, DelegateInputEvent, DelegateMouseEvent, DelegateKeyEvent {}
