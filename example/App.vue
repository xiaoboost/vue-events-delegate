<template>
<main>
    <div
        v-if="show"
        class="main__warp"
        v-delegate:click-a.left="['.event-block__warp', clickTexts1]"
        v-delegate:click-b.left.capture="['.event-block__warp', clickTexts2]"
        v-delegate:click-c.left.capture="['.event-block__inner i', clickTexts3]"
        v-delegate:click-d.left.once="['.event-block__inner i', clickTexts4]">
        <div v-for="item in texts" :key="item" class="event-block__warp" :index-data="item">
            <div class="event-block" v-text="item"></div>
            <div class="event-block__inner">
                <i v-text="`inner-${item}`" :index-data="`inner-${item}`"></i>
            </div>
        </div>
    </div>

    <button @click="show = false">hidden the list</button>
    <button @click="triggerNativeEvent">trigger native event</button>
</main>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { DelegateEvent } from '../types';

@Component
export default class App extends Vue {
    show = true;

    texts = ['mouse-01', 'mouse-02', 'mouse-03', 'mouse-04', 'mouse-05'];

    clickTexts1(e: DelegateEvent) {
        console.log(e.currentTarget.getAttribute('index-data') + ', 冒泡');
    }
    clickTexts2(e: DelegateEvent) {
        console.log(e.currentTarget.getAttribute('index-data') + ', 捕获');
    }
    clickTexts3(e: DelegateEvent) {
        console.log(e.currentTarget.getAttribute('index-data') + ', 捕获');
    }
    clickTexts4(e: DelegateEvent) {
        console.log('once event');
    }
    triggerNativeEvent() {
        const elem = document.querySelector('.event-block__inner i') as HTMLElement;
        this.triggerDelegateEvent(elem, 'click');
    }
};
</script>

<style scoped>
.main__warp {
    display: flex;
}
.event-block__warp {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    border: 2px solid #888;
    flex-direction: column;
}
</style>
