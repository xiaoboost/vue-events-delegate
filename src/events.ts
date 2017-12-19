enum Props {
    // Event
    x01 = 'bubbles',
    x02 = 'cancelable',
    x03 = 'cancelBubble',
    x04 = 'eventPhase',
    x05 = 'isTrusted',
    x06 = 'target',
    x07 = 'currentTarget',
    x08 = 'type',

    // MouseEvent
    x09 = 'button',
    x10 = 'buttons',
    x11 = 'clientX',
    x12 = 'clientY',
    x13 = 'movementX',
    x14 = 'movementY',
    x15 = 'offsetX',
    x16 = 'offsetY',
    x17 = 'pageX',
    x18 = 'pageY',
    x19 = 'screenX',
    x20 = 'screenY',
    x21 = 'x',
    x22 = 'y',

    // WheelEvent
    x23 = 'deltaX',
    x24 = 'deltaY',
    x25 = 'deltaZ',
    x26 = 'deltaMode',

    // KeyboardEvent
    x27 = 'altKey',
    x28 = 'code',
    x29 = 'ctrlKey',
    x30 = 'key',
    x31 = 'locale',
    x32 = 'location',
    x33 = 'metaKey',
    x34 = 'repeat',
    x35 = 'shiftKey',

    // ignore
    // x04 = 'composed',
    // x20 = 'region',
    // x32 = 'isComposing',
}

type AllEvent = Event & MouseEvent & KeyboardEvent & WheelEvent;
type AvailProps = { [key in Props]: AllEvent[key] };

/** class delegate base event */
abstract class Delegate implements AvailProps {
    _originalEvent: { [key: string]: any };

    // Event
    bubbles: boolean;
    cancelable: boolean;
    cancelBubble: boolean;
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
    key: string;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
}

for (const key in Props) {
    const prop = Props[key];

    Object.defineProperty(Delegate.prototype, prop, {
        get(this: Delegate): any {
            return this._originalEvent[prop];
        },
        set(this: Delegate, value): void {
            // direct assignment causes stack Overflow
            Object.defineProperty(this, prop, {
                value,
                writable: true,
                enumerable: true,
                configurable: false,
            });
        },
        enumerable: true,
        configurable: true,
    });
}

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
