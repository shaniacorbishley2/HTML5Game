import { Module } from 'vuex';
import { RootState } from '../store';
import { GetterTree } from 'vuex';
import { MutationTree } from 'vuex';
import { ActionTree } from 'vuex';
import PlayerState from '../states/playerState';

const state: PlayerState = {
    health: (state: PlayerState) => state.health
};

const getters: GetterTree<PlayerState, RootState> = {
    health: (state: PlayerState) => {
        return state.health;
    }
};

const mutations: MutationTree<PlayerState> = {
    setHealth(state: PlayerState, health: number) {
        state.health = health;
    }   
};

const actions: ActionTree<PlayerState, RootState> = {
    setHealth({ commit }, health: number) {
        commit('setHealth', health);
    }
};

export const playerModule: Module<PlayerState, RootState> = {
    state,
    getters,
    mutations,
    actions
};

