import Player from "./player";
import PlayerInfo from "../interfaces/playerInfo";
export default class TeamPlayer extends Player {

    constructor (scene: Phaser.Scene, playerInfo: PlayerInfo ) {
        super(scene, playerInfo.playerId);
    }
}