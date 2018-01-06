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
