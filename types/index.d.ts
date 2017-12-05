import Vue from 'vue';
import { Modifiers } from './options';
import { DelegateEvent } from './events';

export * from './events';
export * from './options';

type callback = (e: DelegateEvent) => void | boolean;

declare module 'vue/types/vue' {
    interface Vue {
        /**
         * Attach an event handler function for a selected element.
         * @param {HTMLElement} el
         * @param {string} type
         * @param {callback} fn
         * @param {Modifiers} [option]
         */
        delegateOn(el: HTMLElement, type: string, fn: callback, option?: Modifiers): void;
        /**
         * Attach an event handler function for a selected element with selector.
         * @param {HTMLElement} el
         * @param {string} type
         * @param {(string | undefined)} selector
         * @param {callback} fn
         * @param {Modifiers} [option]
         */
        delegateOn(el: HTMLElement, type: string, selector: string | undefined, fn: callback, option?: Modifiers): void;

        /**
         * Remove all events handler in the el.
         * @param {el} HTMLElement
         */
        delegateOff(el: HTMLElement): void;

        /**
         * Remove all matching events handler in the el.
         * @param {HTMLElement} el
         * @param {string} option - option can be type of event or selector that pass in .delegateOn()
         * @param {callback} [fn]
         */
        delegateOff(el: HTMLElement, option: string, fn?: callback): void;

        /**
         * Remove all matching events handler in the el.
         * @param {HTMLElement} el
         * @param {string} type
         * @param {string} [selector]
         * @param {callback} [fn]
         */
        delegateOff(el: HTMLElement, type: string, selector?: string, fn?: callback): void;
    }
}
