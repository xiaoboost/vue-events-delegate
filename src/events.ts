/** class delegate base event */
abstract class Delegate {
    _originalEvent: { [key: string]: any };

    // Event
    get bubbles(): boolean {
        return this._originalEvent.bubbles;
    }
    get cancelable(): boolean {
        return this._originalEvent.cancelable;
    }
    get cancelBubble(): boolean {
        return this._originalEvent.cancelBubble;
    }
    get composed(): boolean {
        return this._originalEvent.composed;
    }
    get eventPhase(): number {
        return this._originalEvent.eventPhase;
    }
    get isTrusted(): boolean {
        return this._originalEvent.isTrusted;
    }

    // MouseEvent
    get button(): number {
        return this._originalEvent.button;
    }
    get buttons(): number {
        return this._originalEvent.buttons;
    }
    get clientX(): number {
        return this._originalEvent.clientX;
    }
    get clientY(): number {
        return this._originalEvent.clientY;
    }
    get movementX(): number {
        return this._originalEvent.movementX;
    }
    get movementY(): number {
        return this._originalEvent.movementY;
    }
    get offsetX(): number {
        return this._originalEvent.offsetX;
    }
    get offsetY(): number {
        return this._originalEvent.offsetY;
    }
    get pageX(): number {
        return this._originalEvent.pageX;
    }
    get pageY(): number {
        return this._originalEvent.pageY;
    }
    get region(): string {
        return this._originalEvent.region;
    }
    get screenX(): number {
        return this._originalEvent.screenX;
    }
    get screenY(): number {
        return this._originalEvent.screenY;
    }
    get x(): number {
        return this._originalEvent.x;
    }
    get y(): number {
        return this._originalEvent.y;
    }

    // WheelEvent
    get deltaX(): number {
        return this._originalEvent.deltaX;
    }
    get deltaY(): number {
        return this._originalEvent.deltaY;
    }
    get deltaZ(): number {
        return this._originalEvent.deltaZ;
    }
    get deltaMode(): number {
        return this._originalEvent.deltaMode;
    }

    // KeyboardEvent
    get altKey(): boolean {
        return this._originalEvent.altKey;
    }
    get code(): string {
        return this._originalEvent.code;
    }
    get ctrlKey(): boolean {
        return this._originalEvent.ctrlKey;
    }
    get isComposing(): boolean {
        return this._originalEvent.isComposing;
    }
    get key(): string {
        return this._originalEvent.key;
    }
    get locale(): string {
        return this._originalEvent.locale;
    }
    get location(): number {
        return this._originalEvent.location;
    }
    get metaKey(): boolean {
        return this._originalEvent.metaKey;
    }
    get repeat(): boolean {
        return this._originalEvent.repeat;
    }
    get shiftKey(): boolean {
        return this._originalEvent.shiftKey;
    }

    // methods
    getModifierState(keyArg: string): boolean {
        return this._originalEvent.getModifierState(keyArg);
    }
}

/** Delegate Event  */
export class $Event extends Delegate {
    currentTarget: HTMLElement;
    delegateTarget: HTMLElement;
    target: HTMLElement;
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
