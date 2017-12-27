// @link: https://github.com/jquery/jquery/blob/master/test/unit/event.js

import Vue from 'vue';
import delegate from '../src';
import * as utils from './utils';

Vue.use(delegate);

describe('base function', () => {
    let vm;
    afterEach(() => utils.destroyVM(vm));

    describe('mouse event', () => {
        vm = utils.createVue({
            template:
                `<div
                    class="outter"
                    v-delegate:click-a="['.text1', clickHandler1]"
                    v-delegate:click-b="['.text2', clickHandler2]"
                    v-delegate:mouseenter="['.inner', mouseenterHandler]"
                    v-delegate:mouseleave="['.inner', mouseleaveHandler]">
                    <div class="inner">
                        <span class="text1">第一个文本</span>
                        <span class="text2">第二个文本</span>
                    </div>
                </div>`,

            data() {
                return {
                    textClick01: 0,
                    textClick02: 0,
                    mouseenter: 0,
                    mouseleave: 0,
                };
            },
            methods: {
                clickHandler1() {
                    this.textClick01++;
                },
                clickHandler2() {
                    this.textClick02++;
                },
                mouseenterHandler() {
                    this.mouseenter++;
                },
                mouseleaveHandler() {
                    this.mouseleave++;
                },
            },
        });

        it('click event', () => {
            const text1 = vm.$el.querySelector('.text1');
            // const text2 = vm.$el.querySelector('.text2');

            vm.triggerEvent(text1, 'click');
            expect(vm.textClick01).to.equal(1);
            expect(vm.textClick02).to.equal(0);
            // triggerEvent(text2, 'click');
            // expect(vm.textClick01).to.equal(1);
            // expect(vm.textClick02).to.equal(1);
        });
    });
});
