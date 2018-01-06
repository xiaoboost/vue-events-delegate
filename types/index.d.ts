import Vue from 'vue';
import { DelegateCallback } from './events';
import { Modifiers, Options } from './options';

export * from './events';
export * from './options';

interface DataOn {
    el: HTMLElement;
    type: string;
    selector?: string;
    fn: DelegateCallback;
    option?: Modifiers;
}

interface DataOff {
    el: HTMLElement;
    type?: string;
    selector?: string;
    fn?: DelegateCallback;
    capture?: boolean;
}

declare module 'vue/types/vue' {
    interface Vue {
        /**
         * Attach an event handler function for a selected element.
         * @param {DataOn} option
         */
        delegateOn(option: DataOn): void;

        /**
         * Remove all events handler in the el.
         * @param {el} HTMLElement
         */
        delegateOff(el: HTMLElement): void;

        /**
         * Remove all matching events handler in the el.
         * @param {DataOff} option
         */
        delegateOff(option: DataOff): void;

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
        trigger$Event(elem: HTMLElement, name: string, opts?: Options): void;
    }
}
