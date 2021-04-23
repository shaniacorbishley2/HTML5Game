import PlayerCollision from '@/game/objects/interfaces/playerCollision';
import PlayerHealth from '@/game/objects/interfaces/playerHealth';
import PlayerInfo from '@/game/objects/interfaces/playerInfo';
import Player from '@/game/objects/player/player';
import PlayScene from '@/game/scenes/playScene';
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
    }),
    teamPlayers: (): Player[] => {
        return state.players.filter((player: Player) => player.playerId !== state.mainPlayerId);
    }
};

export const mutations: MutationTree<IPlayerState> = {
    mainPlayerId: (state: IPlayerState, playerId: string) => {
        state.mainPlayerId = playerId;
    },
    playerDisconnected: ( state: IPlayerState, players: Player[] ) => {
        state.players = players;
    },
    addPlayer: (state: IPlayerState, player: Player) => {
        if (!state.players.includes(player)) {
            state.players.push(player);
        }
    },
};

export const actions: ActionTree<IPlayerState, IRootState> = {
    submitUpdateHealth({}, playerHealth: PlayerHealth) {
        state.players.find((player: Player, index) => {
            if (player.playerId == playerHealth.playerId) {
                state.players[index].playerHealth += playerHealth.health;
            }
        });
    },
    submitMainPlayerId({ commit }, playerId: string) {
        commit('mainPlayerId', playerId);
    },
    submitPlayerCollisions({}, playerCollision: PlayerCollision ) {
        state.players.forEach((player: Player) => {
            if (playerCollision.callback) {
                player.scene.physics.add.collider(player, playerCollision.colliderObject, playerCollision.callback);
            }
            player.scene.physics.add.collider(player, playerCollision.colliderObject);
        });
    },
    submitPlayerOverlap({}, playerCollision: PlayerCollision){
        state.players.forEach((player: Player) => {
            if (playerCollision.callback) {
                player.scene.physics.add.overlap(player, playerCollision.colliderObject, playerCollision.callback);
            }
        });
    },
    submitTeamPlayersLocation({}, playersInfo: PlayerInfo[]) {
        state.players.forEach((player: Player) => {
            const matchingPlayer = playersInfo.find((playerInfo) => player.playerId === playerInfo.playerId);

            if (matchingPlayer && matchingPlayer.playerMovement && player.playerMovement && matchingPlayer.playerId !== state.mainPlayerId) {
                
                player.setX(matchingPlayer.playerMovement.x);
                player.setY(matchingPlayer.playerMovement.y); 
            }
        });
    },
    submitPlayersMovement({}, playersInfo: PlayerInfo[]) {
        state.players.forEach((player: Player) => {
            const matchingPlayer = playersInfo.find((playerInfo) => player.playerId === playerInfo.playerId);

            if (matchingPlayer && matchingPlayer.playerMovement && player.playerMovement) {

                player.playerMovement.currentMovement = matchingPlayer.playerMovement.currentMovement;
                player.playerMovement.previousMovement = matchingPlayer.playerMovement.previousMovement;
            }
        });
    },
    submitPlayerDisconnected({ commit }, playersInfo: PlayerInfo[]) {
        if (playersInfo.length !== state.players.length) {
            playersInfo.forEach((playerInfo: PlayerInfo) =>  {
                const updatedPlayers: Player[] = state.players.filter((player) => {
                    if (player.playerId !== playerInfo.playerId) {
                        player.destroy();
                    }
                    return player.playerId === playerInfo.playerId;
                });

                commit('playerDisconnected', updatedPlayers);
            });
        }
    },
    submitAddPlayer({ commit}, player: Player) {
        commit('addPlayer', player);
    }
};

export const playerModule: Module<IPlayerState, IRootState> = {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};

