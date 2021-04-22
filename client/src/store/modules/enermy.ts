import {GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import  IRootState  from '../states/interfaces';
import IEnermyState from '../states/interfaces/enermyState';
import EnermyState from '../states/enermyState';
import GameObjectConfig from '@/game/objects/interfaces/gameObjectConfig';

export const state: IEnermyState = new EnermyState();

export const getters: GetterTree<IEnermyState, IRootState> = {
    config: (state: IEnermyState) => state.config,
    enermyObjects: (state: IEnermyState) => state.enermyObjects
};

export const mutations: MutationTree<IEnermyState> = {
    submitEnermyObjects: (state: IEnermyState, enermyObjects: Phaser.GameObjects.Image[]) => {
        state.enermyObjects = enermyObjects;
    }
};

export const actions: ActionTree<IEnermyState, IRootState> = {
    submitEnermyObjects({ commit }, object: GameObjectConfig) {
        let enermyObjects: Phaser.GameObjects.Image[] = [];

        for (let i = 0; i <= object.amount; i++) {
            const gameObject: Phaser.GameObjects.Image = new Phaser.GameObjects.Image(object.scene, Phaser.Math.Between(100, 340), object.y, object.texture);
            gameObject.setScale(0.5);
            enermyObjects.push(gameObject);
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

