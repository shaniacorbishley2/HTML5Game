import {GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import  IRootState  from '../states/interfaces';
import GameObjectConfig from '@/game/objects/interfaces/gameObjectConfig';
import IGameObjectState from '../states/interfaces/gameObjectState';
import GameObjectState from '../states/gameObjectState';
import Phaser from 'phaser';

export const state: IGameObjectState = new GameObjectState();

export const getters: GetterTree<IGameObjectState, IRootState> = {
    enermyConfig: (state: IGameObjectState) => state.enermyConfig,
    enermyObjects: (state: IGameObjectState) => state.enermyObjects,
    collectableObjects: (state: IGameObjectState) => state.collectableObjects,
    collectableConfig: (state: IGameObjectState) => state.collectableConfig
};

export const mutations: MutationTree<IGameObjectState> = {
    submitCollectableObjects: (state: IGameObjectState, collectableObjects: Phaser.GameObjects.Image[]) => {
        state.collectableObjects = collectableObjects;
    },
    submitEnermyObjects: (state: IGameObjectState, enermyObjects: Phaser.GameObjects.Image[]) => {
        state.enermyObjects = enermyObjects;
    }
};

export const actions: ActionTree<IGameObjectState, IRootState> = {
    submitCollectableObjects({ commit }, object: GameObjectConfig) {
        let collectableObjects: Phaser.GameObjects.Image[] = [];

        for (let i = 0; i <= object.amount; i++) {
            const gameObject: Phaser.GameObjects.Image = new Phaser.GameObjects.Image(object.scene, Phaser.Math.Between(100, 340), object.y, object.texture);
            collectableObjects.push(gameObject);
        }

        commit('submitCollectableObjects', collectableObjects);
    },

    submitEnermyObjects({ commit }, object: GameObjectConfig) {
        let enermyObjects: Phaser.GameObjects.Image[] = [];

        for (let i = 0; i <= object.amount; i++) {
            const gameObject: Phaser.GameObjects.Image = new Phaser.GameObjects.Image(object.scene, Phaser.Math.Between(100, 340), object.y, object.texture);
            gameObject.setScale(0.5);
            enermyObjects.push(gameObject);
        }

        commit('submitEnermyObjects', enermyObjects);
    },
    submitFullscreenObject({}, scene: Phaser.Scene) {
        const fullscreen: Phaser.GameObjects.Image = scene.add.image(16, 16, 'fullscreen').setScale(2);
        fullscreen.setInteractive().on('pointerdown', function() {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
                // On stop fulll screen
            } else {
                this.scale.startFullscreen();
                // On start fulll screen
            }
        }, scene);
    }
};

export const gameObjectModule: Module<IGameObjectState, IRootState> = {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};

