import {
    DelegateEvent,
    DelegateCallback,
    Modifiers,
} from 'types';

interface OnParams {
    type: string;
    selector: string;
    fn: DelegateCallback;
}

interface OffParams {
    type: string;
    selector: string;
    fn?: DelegateCallback;
}

/** fix the format of paramters that passing in .on() */
export function fixOnParams(type: string, selector: string | DelegateCallback, fn?: DelegateCallback): OnParams {

}

/** fix the format of paramters that passing in .off() */
export function fixOffParams(type?: string, selector?: string, fn?: DelegateCallback): OffParams {

}

/**
 * Wrapper the function
 * @param {DelegateCallback} callback
 * @param {Modifiers} modifiers
 * @returns {DelegateCallback}
 */
export function fnWrapper(callback: DelegateCallback, modifiers: Modifiers): DelegateCallback {
    return function packFn(event: DelegateEvent) {
        let self = true, left = true, right = true, esc = true, enter = true;

        if (modifiers.self) {
            self = event.currentTarget === event.target;
        }
        if (modifiers.left) {
            left = event.button === 0;
        }
        if (modifiers.right) {
            right = event.button === 2;
        }
        if (modifiers.esc) {
            esc = event.key === 'Escape';
        }
        if (modifiers.enter) {
            enter = event.key === 'Enter';
        }

        // TODO: once

        if (self && left && right && esc && enter) {
            const ans = callback(event);

            if (modifiers.stop) {
                event.stopPropagation();
            }
            if (modifiers.prevent) {
                event.preventDefault();
            }

            return ans;
        }
    };
}
