<template>
<div>
    <input v-model="msg">
    <p>msg: {{msg}}</p>
    <button @click="greet">Greet</button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
    msg = 'Hello';

    greet() {

    };
};
</script>
