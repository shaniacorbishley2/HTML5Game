import {GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import  IRootState  from '../states/interfaces';
import IPlayerState from '../states/interfaces/playerState';
import PlayerState from '../states/playerState';

export const state: IPlayerState = new PlayerState();

export const getters: GetterTree<IPlayerState, IRootState> = {
    health: (state: IPlayerState) => state.health
};

export const mutations: MutationTree<IPlayerState> = {
    setHealth: (state: IPlayerState, health: number) => {
        state.health = health;
    },
    updateHealth: (state: IPlayerState, amount: number) => {
        state.health += amount;
    }
};

export const actions: ActionTree<IPlayerState, IRootState> = {
    setHealth({ commit }, health: number) {
        commit('setHealth', health);
    },
    updateHealth({ commit }, amount: number) {
        commit('updateHealth', amount);
    }
};

export const playerModule: Module<IPlayerState, IRootState> = {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};

