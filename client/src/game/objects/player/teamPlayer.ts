import Player from "./player";
import Movement from '../enums/movement'
import PlayerMovement from "../interfaces/playerMovement";

export default class TeamPlayer extends Player {

    public playerMovement: PlayerMovement = { playerId: this.playerId, x: 0, y: 0, currentMovement: Movement.None};

    constructor (scene: Phaser.Scene, playerId: string ) {
        super(scene, playerId);
    }

    public checkPlayerMovement() {
        this.setX(this.playerMovement.x);
        this.setY(this.playerMovement.y);
    }
    
}