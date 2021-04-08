import Vue from 'vue';
import App from './App.vue';

import { store } from './store';
import './scss/main.scss';

export default new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
