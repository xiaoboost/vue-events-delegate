import Vue from 'vue';

/**
 * create a DIV dom and append to body.
 * @return {HTMLDivElement} DOM
 */
function createElm() {
    const elm = document.createElement('div');
    document.body.appendChild(elm);
    return elm;
}

/**
 * Destroy a instance of Vue
 * @param {Vue} vm
 */
export function destroyVM(vm) {
    vm.$el &&
    vm.$el.parentNode &&
    vm.$el.parentNode.removeChild(vm.$el);
}

/**
 * create a instance of Vue
 * @param {ComponentOptions} Compo
 * @param {boolean} [mounted=true]
 * @return {Vue} vm
 */
export function createVue(Compo, mounted = true) {
    const data = (typeof Compo === 'string')
        ? { template: Compo }
        : Compo;

    return new Vue(data).$mount(mounted ? createElm() : undefined);
}
