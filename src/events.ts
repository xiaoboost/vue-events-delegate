/** class delegate base event */
abstract class Delegate {
    _originalEvent: { [key: string]: any };

    // Event
    bubbles: boolean;
    cancelable: boolean;
    cancelBubble: boolean;
    composed: boolean;
    eventPhase: number;
    isTrusted: boolean;
    target: HTMLElement;
    currentTarget: HTMLElement;
    type: string;

    // MouseEvent
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
    region: string;
    screenX: number;
    screenY: number;
    x: number;
    y: number;

    // WheelEvent
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    deltaMode: number;

    // KeyboardEvent
    altKey: boolean;
    code: string;
    ctrlKey: boolean;
    isComposing: boolean;
    key: string;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;

    // methods
    getModifierState(keyArg: string): boolean {
        type fn = (key: string) => boolean;
        return (this._originalEvent.getModifierState as fn)(keyArg);
    }
}

const properties = [
    // Event
    'bubbles',
    'cancelable',
    'cancelBubble',
    'composed',
    'eventPhase',
    'isTrusted',
    'target',
    'currentTarget',
    'type',
    // MouseEvent
    'button',
    'buttons',
    'clientX',
    'clientY',
    'movementX',
    'movementY',
    'offsetX',
    'offsetY',
    'pageX',
    'pageY',
    'region',
    'screenX',
    'screenY',
    'x',
    'y',
    // WheelEvent
    'deltaX',
    'deltaY',
    'deltaZ',
    'deltaMode',
    // KeyboardEvent
    'altKey',
    'code',
    'ctrlKey',
    'isComposing',
    'key',
    'locale',
    'location',
    'metaKey',
    'repeat',
    'shiftKey',
];

properties.forEach((property) => {
    Object.defineProperty(Delegate.prototype, property, {
        get(this: Delegate): any {
            return this._originalEvent[property];
        },
        set(this: Delegate, value): void {
            // direct assignment causes stack Overflow
            Object.defineProperty(this, property, {
                value,
                writable: true,
                enumerable: true,
                configurable: false,
            });
        },
        enumerable: true,
        configurable: true,
    });
});

/** Delegate Event  */
export class $Event extends Delegate {
    currentTarget: HTMLElement;
    delegateTarget: HTMLElement;
    type: string;

    isDefaultPrevented = false;
    isPropagationStopped = false;
    isImmediatePropagationStopped = false;

    relatedTarget: HTMLElement;
    result: any;

    _originalEvent: Event;

    constructor(originEvent: Event) {
        super();
        this._originalEvent = originEvent;
    }

    preventDefault(): void {
        this.isDefaultPrevented = true;
        this._originalEvent.preventDefault();
    }
    stopPropagation(): void {
        this.isPropagationStopped = true;
        this._originalEvent.stopPropagation();
    }
    stopImmediatePropagation(): void {
        this.isImmediatePropagationStopped = true;
        this._originalEvent.stopImmediatePropagation();
        this.stopPropagation();
    }
}

/** Delegate Callback */
export type $Callback = (event: $Event) => any;
