import Vue from 'vue';
import delegate from '../src';
import { destroyVM, createVue } from './utils';

Vue.use(delegate);

let vm;
afterEach(() => destroyVM(vm));

describe('basic usage', () => {
    const template = {
        template: `
            <div v-delegate:click="['.a', onClickA]">
                <div>
                    <div class="a"></div>
                    <div class="b"></div>
                </div>
            </div>`,
        data() {
            return {
                clickA: 0,
                clickB: 0,
            };
        },
        methods: {
            onClickA() {
                this.clickA++;
            },
            onClickB() {
                this.clickB++;
            },
        },
    };

    it('trigger the event and the handler runs', () => {
        vm = createVue(template);

        const elm = vm.$el.querySelector('.a');
        // origin event
        vm.triggerEvent(elm, 'click');
        expect(vm.clickA).to.equal(1);
        // delegate event
        vm.trigger$Event(elm, 'click');
        expect(vm.clickA).to.equal(2);
    });

    it('trigger handler that binding by ".delegateOn()"', () => {
        vm = createVue(template);

        vm.delegateOn({
            el: vm.$el,
            type: 'click',
            selector: '.b',
            fn: vm.onClickB,
        });

        const elmA = vm.$el.querySelector('.a');
        const elmB = vm.$el.querySelector('.b');

        vm.triggerEvent(elmA, 'click');
        expect(vm.clickA).to.equal(1);
        expect(vm.clickB).to.equal(0);

        vm.triggerEvent(elmB, 'click');
        expect(vm.clickA).to.equal(1);
        expect(vm.clickB).to.equal(1);
    });

    it('handler should not run after remove handler', () => {
        vm = createVue(template);

        const elm = vm.$el.querySelector('.a');

        vm.triggerEvent(elm, 'click');
        expect(vm.clickA).to.equal(1);

        vm.delegateOff(vm.$el);

        vm.triggerEvent(elm, 'click');
        expect(vm.clickA).to.equal(1);
    });
});

describe('null or undefined handler', () => {
    it('Binding a null handler in template will throw an exception', () => {
        try {
            vm = createVue({ template: '<div v-delegate:click="null"></div>' });
        }
        catch (error) {
            expect(error.message).to.equal('(delegate) must input callback');
        }
    });
    it('Binding a undefined handler in template will throw an exception', () => {
        try {
            vm = createVue({ template: '<div v-delegate:click="undefined"></div>' });
        }
        catch (error) {
            expect(error.message).to.equal('(delegate) must input callback');
        }
    });
});

describe('multiple events at once', () => {
    it('once as a modifier in templete', () => {
        vm = createVue({
            template: `
                <div v-delegate:click.once="['.a', onClick]">
                    <div>
                        <div class="a"></div>
                    </div>
                </div>`,
            data() {
                return {
                    click: 0,
                };
            },
            methods: {
                onClick() {
                    this.click++;
                },
            },
        });

        const elm = vm.$el.querySelector('.a');

        expect(vm.click).to.equal(0);
        vm.triggerEvent(elm, 'click');
        expect(vm.click).to.equal(1);
        vm.triggerEvent(elm, 'click');
        expect(vm.click).to.equal(1);
    });
    it('once as a option that pass in .delegateOn()', () => {
        vm = createVue({
            template: '<div><div><div class="a"></div></div></div>',
            data() {
                return {
                    click: 0,
                };
            },
            methods: {
                onClick() {
                    this.click++;
                },
            },
        });

        const elm = vm.$el.querySelector('.a');

        vm.delegateOn({
            el: vm.$el,
            type: 'click',
            selector: '.a',
            fn: vm.onClick,
            option: { once: true },
        });

        expect(vm.click).to.equal(0);
        vm.triggerEvent(elm, 'click');
        expect(vm.click).to.equal(1);
        vm.triggerEvent(elm, 'click');
        expect(vm.click).to.equal(1);
    });
});

describe('order of all events running', () => {
    it('order of delegate event\'s is same as origin event callback.', () => {
        vm = createVue({
            template: `
                <div
                    v-delegate:click="['*', clickPop]"
                    v-delegate:click.capture="['*', clickCap]">
                    <div><p><span><b class='a'>b</b></span></p></div>
                </div>`,
            data() {
                return {
                    path: [],
                };
            },
            methods: {
                clickPop(ev) {
                    this.path.push('pop:' + ev.currentTarget.nodeName.toLowerCase());
                },
                clickCap(ev) {
                    this.path.push('cap:' + ev.currentTarget.nodeName.toLowerCase());
                },
            },
        });

        const elm = vm.$el.querySelector('.a');
        vm.triggerEvent(elm, 'click');
        expect(vm.path.join(', ')).to.equal('cap:div, cap:p, cap:span, cap:b, pop:b, pop:span, pop:p, pop:div');
    });

    it('order of mix events', () => {
        const path = [];

        vm = createVue({
            template: `
                <div
                    v-delegate:click="['*', clickPop]"
                    v-delegate:click.capture="['*', clickCap]">
                    <div><p><span><b class='a'>b</b></span></p></div>
                </div>`,
            methods: {
                clickPop(ev) {
                    path.push('$$pop:' + ev.currentTarget.nodeName.toLowerCase());
                },
                clickCap(ev) {
                    path.push('$$cap:' + ev.currentTarget.nodeName.toLowerCase());
                },
            },
        });

        const elm = vm.$el.querySelector('.a');
        const nodes = [].slice.call(vm.$el.querySelectorAll('*'));

        nodes.forEach((el) => {
            el.addEventListener('click', (ev) => {
                path.push('pop:' + ev.currentTarget.nodeName.toLowerCase());
            });
            el.addEventListener('click', (ev) => {
                path.push('cap:' + ev.currentTarget.nodeName.toLowerCase());
            }, true);
        });

        vm.triggerEvent(elm, 'click');
        expect(path.join(', ')).to.equal(
            '$$cap:div, $$cap:p, $$cap:span, $$cap:b, cap:div, cap:p, cap:span, ' +
            'pop:b, cap:b, pop:span, pop:p, pop:div, $$pop:b, $$pop:span, $$pop:p, $$pop:div'
        );
    });
});

describe('delegate event without selector', () => {
    it('use in template', () => {
        vm = createVue({
            template: '<div v-delegate:click="onClick"><p><span></span></p></div>',
            data() {
                return {
                    click: 0,
                };
            },
            methods: {
                onClick() {
                    this.click++;
                },
            },
        });

        vm.triggerEvent(vm.$el, 'click');
        expect(vm.click).to.equal(1);
        vm.trigger$Event(vm.$el, 'click');
        expect(vm.click).to.equal(2);
    });
    it('use in .delegateOn()', () => {
        vm = createVue({ template: '<div><p><span></span></p></div>' });

        let click = 0;

        vm.delegateOn({
            el: vm.$el,
            type: 'click',
            fn: () => click++,
        });

        vm.triggerEvent(vm.$el, 'click');
        expect(click).to.equal(1);
        vm.trigger$Event(vm.$el, 'click');
        expect(click).to.equal(2);
    });
});
