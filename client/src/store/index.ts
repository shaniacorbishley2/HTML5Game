import Vuex from 'vuex';
import Vue from 'vue';
import { playerModule } from './modules/player';
import { gameObjectModule } from './modules/gameObject';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    playerModule,
    gameObjectModule
  }
});