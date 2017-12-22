import Vue from 'vue';
import { ComponentOptions } from 'vue/types/options';

type DefaultComponentOptions = ComponentOptions<Vue>;

/**
 * create a DIV dom and append to body.
 * @return {HTMLDivElement} DOM
 */
const createElm = () => {
    const elm = document.createElement('div');
    document.body.appendChild(elm);
    return elm;
};

/**
 * Destroy a instance of Vue
 * @param {Vue} vm
 */
export function destroyVM(vm: Vue): void {
    vm.$el &&
    vm.$el.parentNode &&
    vm.$el.parentNode.removeChild(vm.$el);
}

/**
 * create a instance of Vue
 * @param {(DefaultComponentOptions | string)} Compo
 * @param {boolean} [mounted=true]
 * @return {Vue} vm
 */
export function createVue(Compo: DefaultComponentOptions | string, mounted = true) {
    const data: DefaultComponentOptions = (typeof Compo === 'string')
        ? { template: Compo }
        : Compo;

    return new Vue(data).$mount(mounted ? createElm() : undefined);
}
