import { add, remove } from './delegate';
import { $Event, $Callback } from './events';

import { Vue, VueConstructor } from 'vue/types/vue';
import { VNodeDirective } from 'vue/types/vnode';

interface Modifiers { [key: string]: boolean; }

const functionMap = new Map<$Callback, $Callback>();

/**
 * Wrapper the function
 * @param {$Callback} callback
 * @param {Modifiers} modifiers
 * @returns {$Callback}
 */
export function fnWrapper(callback: $Callback, modifiers: Modifiers): $Callback {
    return function packFn(event: $Event) {
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

/**
 * Fix the type of input event
 * @param {string} type
 * @returns {string}
 */
function fixType(type: string): string {
    const match = type && type.match(/^[a-z]+/i);

    if (!match) {
        throw (new Error('Illegal Event'));
    }

    return match[0];
}

export default {
    install(App: VueConstructor) {
        App.directive('delegate', {
            bind(el: HTMLElement, binding: VNodeDirective): void {
                const value = (binding.value instanceof Array) ? binding.value : ['', binding.value];

                const [selector, callback] = value as [string, $Callback];
                const handler = fnWrapper(callback, binding.modifiers);
                const type = fixType(binding.arg);

                functionMap.set(callback, handler);
                add(el, type, selector, handler, binding.modifiers.capture);
            },
            unbind(el: HTMLElement, binding: VNodeDirective): void {
                const value = (binding.value instanceof Array) ? binding.value : ['', binding.value];

                const [selector, callback] = value as [string, $Callback];
                const handler = fnWrapper(callback, binding.modifiers);
                const type = fixType(binding.arg);

                functionMap.delete(callback);
                remove(el, type, selector, handler, binding.modifiers.capture);
            },
        });

        App.prototype.delegateOn = function(el: HTMLElement, type: string, selector: string | $Callback, fn: $Callback | Modifiers, option?: Modifiers): Vue {

            return this;
        };

        App.prototype.delegateOff = function(el?: HTMLElement, type?: string, selector?: string, fn?: $Callback): Vue {

            return this;
        };
    },
};
