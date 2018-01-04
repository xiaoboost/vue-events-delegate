import Vue from 'vue';

Vue.config.productionTip = false;

// match specs files
const testsContext = require.context('./', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// match all .ts files
const srcContext = require.context('../src', true, /\.ts$/);
srcContext.keys().forEach(srcContext);
