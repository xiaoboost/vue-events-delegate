import Vue from 'vue';
import { DelegateCallback } from './events';
import { Modifiers, Options } from './options';

export * from './events';
export * from './options';

declare module 'vue/types/vue' {
    interface Vue {
        /**
         * Attach an event handler function for a selected element.
         * @param {HTMLElement} el
         * @param {string} type
         * @param {DelegateCallback} fn
         * @param {Modifiers} [option]
         */
        delegateOn(el: HTMLElement, type: string, fn: DelegateCallback, option?: Modifiers): void;
        /**
         * Attach an event handler function for a selected element with selector.
         * @param {HTMLElement} el
         * @param {string} type
         * @param {string} selector
         * @param {DelegateCallback} fn
         * @param {Modifiers} [option]
         */
        delegateOn(el: HTMLElement, type: string, selector: string, fn: DelegateCallback, option?: Modifiers): void;

        /**
         * Remove all events handler in the el.
         * @param {el} HTMLElement
         */
        delegateOff(el: HTMLElement): void;

        /**
         * Remove all matching events handler in the el.
         * @param {HTMLElement} el
         * @param {string} option - option can be type of event or selector that pass in .delegateOn()
         * @param {DelegateCallback} [fn]
         */
        delegateOff(el: HTMLElement, option: string, fn?: DelegateCallback): void;

        /**
         * Remove all matching events handler in the el.
         * @param {HTMLElement} el
         * @param {string} type
         * @param {string} [selector]
         * @param {DelegateCallback} [fn]
         */
        delegateOff(el: HTMLElement, type: string, selector?: string, fn?: DelegateCallback): void;

        /**
         * triggers a native event
         *  - the event of the delegate is also triggered during the execution of the event stream
         * @param {HTMLElement} elem
         * @param {string} name
         * @param {PartialEvent} [opts={}]
         */
        triggerEvent(elem: HTMLElement, name: string, opts?: Options): void;

        /**
         * triggers a delegate event
         * @param {HTMLElement} elem
         * @param {string} name
         * @param {PartialEvent} [opts={}]
         */
        triggerDelegateEvent(elem: HTMLElement, name: string, opts?: Options): void;
    }
}
