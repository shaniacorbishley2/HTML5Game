import Vue from 'vue';
import Vuex from 'vuex';
import { playerModule } from './modules/player';
import PlayerState from './states/playerState';

Vue.use(Vuex);

export type RootState = {
    player: PlayerState;
}

export default new Vuex.Store({
    modules: {
        playerModule: playerModule
    }
});