import { add, remove } from './delegate';
import { fixOnParams, fixOffParams, fnWrapper } from './parameter';

import { Vue, VueConstructor } from 'vue/types/vue';
import { VNodeDirective } from 'vue/types/vnode';
import { DelegateEvent, DelegateCallback, Modifiers } from 'types';

// function mappings
const functionMap = new Map<DelegateCallback, DelegateCallback>();

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
                const value = (binding.value instanceof Array) ? binding.value : [binding.value];
                const params = fixOnParams(binding.arg, value[0], value[1]);
                const handler = fnWrapper(params.fn, binding.modifiers as Modifiers);
                const type = fixType(params.type);

                functionMap.set(params.fn, handler);
                add(el, type, params.selector, handler);
            },
            unbind(el: HTMLElement, binding: VNodeDirective): void {
                const value = (binding.value instanceof Array) ? binding.value : [binding.value];
                const params = fixOnParams(binding.arg, value[0], value[1]);
                const handler = fnWrapper(params.fn, binding.modifiers as Modifiers);
                const type = fixType(params.type);

                functionMap.delete(params.fn);
                remove(el, type, params.selector, handler);
            },
        });

        App.prototype.delegateOn = function(el: HTMLElement, type: string, selector: string | DelegateCallback, fn: DelegateCallback | Modifiers, option?: Modifiers): Vue {

            return this;
        };

        App.prototype.delegateOff = function(el?: HTMLElement, type?: string, selector?: string, fn?: DelegateCallback): Vue {

            return this;
        };
    },
};
