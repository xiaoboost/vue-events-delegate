
/** Delegate Event  */
export class $Event {
    _originalEvent: Event;
    currentTarget: HTMLElement;
    delegateTarget: HTMLElement;
    target: HTMLElement;
    type: string;

    isDefaultPrevented = false;
    isPropagationStopped = false;
    isImmediatePropagationStopped = false;

    relatedTarget: HTMLElement;
    result: any;

    button: number;
    key: string;

    constructor(originEvent: Event) {
        const ans = [];
        for (const key in originEvent) {
            ans.push(key);
        }
        console.log(ans);

        debugger;
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
