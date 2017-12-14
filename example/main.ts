import Vue from 'vue';
import App from './App.vue';
import delegate from '../src';

Vue.use(delegate);
Vue.config.productionTip = true;

new Vue({
    el: '#app',
    name: 'Main',
    render: (h) => h(App),
});
