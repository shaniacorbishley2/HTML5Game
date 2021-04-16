import Vuex from 'vuex';
import Vue from 'vue';
import { playerModule } from './modules/player';
import { enermyModule } from './modules/enermy';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    playerModule,
    enermyModule
  }
});