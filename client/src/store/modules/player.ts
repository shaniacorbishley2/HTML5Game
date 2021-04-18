import PlayerCollision from '@/game/objects/interfaces/playerCollision';
import PlayerHealth from '@/game/objects/interfaces/playerHealth';
import Player from '@/game/objects/player/player';
import {GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import  IRootState  from '../states/interfaces';
import IPlayerState from '../states/interfaces/playerState';
import PlayerState from '../states/playerState';

export const state: IPlayerState = new PlayerState();

export const getters: GetterTree<IPlayerState, IRootState> = {
    mainPlayerId: (state: IPlayerState) => state.mainPlayerId,
    players: (state: IPlayerState) => state.players,
    mainPlayerHealth: (state: IPlayerState) => {
        const player = state.players.find((player: Player) => player.playerId === state.mainPlayerId);
        return player ? player.playerHealth : 0;
    },
    playerIds: () => state.players.map((player) => {
        return player.playerId;
    })
};

export const mutations: MutationTree<IPlayerState> = {
    updateHealth: (state: IPlayerState, playerHealth: PlayerHealth) => {
        state.players.find((player: Player, index) => {
            if (player.playerId == playerHealth.playerId) {
                state.players[index].playerHealth += playerHealth.health;
            }
        });
    },
    mainPlayerId: (state: IPlayerState, playerId: string) => {
        state.mainPlayerId = playerId;
    },
    addPlayer: (state: IPlayerState, player: Player) => {
        if (!state.players.includes(player)) {
            state.players.push(player);
        }
    },
    removePlayer: (state: IPlayerState, playerId: string) => {
        state.players.filter((player) => {
            if (player.playerId === playerId) {
      
              player.destroy();
            }
            return player.playerId !== playerId;
          });
    },
    playerCollisions: (state: IPlayerState, playerCollision: PlayerCollision) => {
        state.players.forEach((player: Player) => {
            if (playerCollision.callback) {
                playerCollision.scene.physics.add.collider(player, playerCollision.colliderObject, playerCollision.callback);
            }
            playerCollision.scene.physics.add.collider(player, playerCollision.colliderObject);
        });
    }
};

export const actions: ActionTree<IPlayerState, IRootState> = {
    updateHealth({ commit }, playerHealth: PlayerHealth) {
        commit('updateHealth', playerHealth);
    },
    submitMainPlayerId({ commit }, playerId: string) {
        commit('mainPlayerId', playerId);
    },
    submitAddPlayer({ commit}, player: Player) {
        commit('addPlayer', player);
    },
    submitRemovePlayer({ commit }, playerId: string) {
        commit('removePlayer', playerId);
    },
    submitPlayerCollisions({ commit }, playerCollision: PlayerCollision ) {
        commit('playerCollisions', playerCollision);
    }
};

export const playerModule: Module<IPlayerState, IRootState> = {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};

