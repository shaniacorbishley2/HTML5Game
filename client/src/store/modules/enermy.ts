import {GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import  IRootState  from '../states/interfaces';
import IEnermyState from '../states/interfaces/enermyState';
import EnermyState from '../states/enermyState';
import GameObjectConfig from '@/game/objects/interfaces/gameObjectConfig';
import Enermy from '@/game/objects/enermy/enermy';

export const state: IEnermyState = new EnermyState();

export const getters: GetterTree<IEnermyState, IRootState> = {
    config: (state: IEnermyState) => state.config,
    enermyObjects: (state: IEnermyState) => state.enermyObjects
};

export const mutations: MutationTree<IEnermyState> = {
    submitEnermyObjects: (state: IEnermyState, enermyObjects: Enermy[]) => {
        state.enermyObjects = enermyObjects;
    }
};

export const actions: ActionTree<IEnermyState, IRootState> = {
    submitEnermyObjects({ commit }, object: GameObjectConfig) {
        let enermyObjects: Enermy[] = [];

        for (let i = 0; i <= object.amount; i++) {
            enermyObjects.push(new Enermy(object.scene, object.texture, Phaser.Math.Between(100, 340)));
        }

        commit('submitEnermyObjects', enermyObjects);
    }
};

export const enermyModule: Module<IEnermyState, IRootState> = {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};

