import PlayerCollision from '@/game/objects/interfaces/playerCollision';
import PlayerHealth from '@/game/objects/interfaces/playerHealth';
import PlayerInfo from '@/game/objects/interfaces/playerInfo';
import PlayerContainer from '@/game/objects/player/playerContainer';
import {GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import  IRootState  from '../states/interfaces';
import IPlayerState from '../states/interfaces/playerState';
import PlayerState from '../states/playerState';

export const state: IPlayerState = new PlayerState();

export const getters: GetterTree<IPlayerState, IRootState> = {
    mainPlayerId: (state: IPlayerState) => state.mainPlayerId,
    players: (state: IPlayerState) => state.players,
    mainPlayerHealth: (state: IPlayerState) => {
        const playerContainer = state.players.find((playerContainer: PlayerContainer) => playerContainer.playerInfo.playerId === state.mainPlayerId);
        return playerContainer ? playerContainer.player.playerHealth : 0;
    },
    scene: (state: IPlayerState) => state.scene,
    playerName: (state:IPlayerState) => state.playerName
};

export const mutations: MutationTree<IPlayerState> = {
    mainPlayerId: (state: IPlayerState, playerId: string) => {
        state.mainPlayerId = playerId;
    },
    playerDisconnected: ( state: IPlayerState, players: PlayerContainer[] ) => {
        state.players = players;
    },
    addPlayer: (state: IPlayerState, player: PlayerContainer) => {
        if (!state.players.includes(player)) {
            state.players.push(player);
        }
    },
    addScene: (state: IPlayerState, scene: Phaser.Scene) => {
        state.scene = scene;
    },
    playerName: (state: IPlayerState, playerName: string) => {
        state.playerName = playerName
    }
};

export const actions: ActionTree<IPlayerState, IRootState> = {
    submitUpdateHealth({}, playerHealth: PlayerHealth) {
        state.players.find((playerContainer: PlayerContainer, index) => {
            if (playerContainer.playerInfo.playerId == playerHealth.playerId) {
                state.players[index].player.playerHealth += playerHealth.health;
            }
        });
    },
    submitMainPlayerId({ commit }, playerId: string) {
        commit('mainPlayerId', playerId);
    },
    submitPlayerCollisions({}, playerCollision: PlayerCollision ) {
        state.players.forEach((playerContainer: PlayerContainer) => {
            if (playerCollision.callback) {
                playerContainer.scene.physics.add.collider(playerContainer, playerCollision.colliderObject, playerCollision.callback);
            }
            playerContainer.scene.physics.add.collider(playerContainer, playerCollision.colliderObject);
        });
    },
    submitPlayerOverlap({}, playerCollision: PlayerCollision){
        state.players.forEach((playerContainer: PlayerContainer) => {
            if (playerCollision.callback) {
                playerContainer.scene.physics.add.overlap(playerContainer, playerCollision.colliderObject, playerCollision.callback);
            }
        });
    },
    submitTeamPlayersLocation({}, playersInfo: PlayerInfo[]) {
        if (state.players.length === playersInfo.length) {

            playersInfo.forEach((playerInfo: PlayerInfo) => {
                const matchingPlayer: PlayerContainer | undefined = state.players.find((playerContainer: PlayerContainer) => playerContainer.playerInfo.playerId === playerInfo.playerId);
            
                if (matchingPlayer && matchingPlayer.playerInfo.playerId !== state.mainPlayerId && (matchingPlayer.x !== playerInfo.playerMovement.x || matchingPlayer.y !== playerInfo.playerMovement.y)) {
                    matchingPlayer.setX(playerInfo.playerMovement.x);
                    matchingPlayer.setY(playerInfo.playerMovement.y);
                }
                
            });
        }
    },
    submitPlayersMovement({}, playersInfo: PlayerInfo[]) {
        if (state.players.length === playersInfo.length) {

            playersInfo.forEach((playerInfo: PlayerInfo) => {
                const matchingPlayer = state.players.find((playerContainer: PlayerContainer) => playerContainer.playerInfo.playerId === playerInfo.playerId);

                if (matchingPlayer && (matchingPlayer.playerInfo.playerMovement.currentMovement.valueOf() !== playerInfo.playerMovement.currentMovement.valueOf() || matchingPlayer.playerInfo.playerMovement.previousMovement.valueOf() !== playerInfo.playerMovement.previousMovement.valueOf())) {

                    matchingPlayer.playerInfo.playerMovement.currentMovement = playerInfo.playerMovement.currentMovement;
                    matchingPlayer.playerInfo.playerMovement.previousMovement = playerInfo.playerMovement.previousMovement;
                    
                    if (matchingPlayer && matchingPlayer.playerInfo.playerId !== state.mainPlayerId && (matchingPlayer.x !== playerInfo.playerMovement.x || matchingPlayer.y !== playerInfo.playerMovement.y)) {
                        matchingPlayer.setX(playerInfo.playerMovement.x);
                        matchingPlayer.setY( playerInfo.playerMovement.y);
                    }
                    
                }
            });
        }
    },
    submitPlayerDisconnected({ commit }, playersInfo: PlayerInfo[]) {
        if (playersInfo.length !== state.players.length) {
            const matchingPlayers: PlayerContainer[] = [];
            state.players.forEach((playerContainer: PlayerContainer) =>  {
                const matchingPlayer = playersInfo.some((playerInfo: PlayerInfo) => playerInfo.playerId === playerContainer.playerInfo.playerId);

                if (matchingPlayer) {
                    matchingPlayers.push(playerContainer);
                }
                else {
                    playerContainer.destroy();
                }
                commit('playerDisconnected', matchingPlayers);
            });
        }
    },
    submitAddPlayer({ commit }, player: PlayerContainer) {
        commit('addPlayer', player);
    },
    submitAddScene({ commit }, scene: Phaser.Scene) {
        commit('addScene', scene);
    },
    submitPlayerName({ commit }, playerName: string) {
        console.log(playerName);
        commit('playerName', playerName);
    }
};

export const playerModule: Module<IPlayerState, IRootState> = {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};

