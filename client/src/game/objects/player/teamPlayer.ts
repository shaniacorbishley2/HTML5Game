import Player from "./player";
import Movement from '../enums/movement'
import PlayerInfo from "../interfaces/playerInfo";

export default class TeamPlayer extends Player {

    public movement: Movement | undefined;

    constructor (scene: Phaser.Scene, playerInfo: PlayerInfo ) {
        super(scene, playerInfo.playerId);
        this.movement = playerInfo.playerMovement?.currentMovement;
    }


    public checkPlayerMovement() {
        switch(this.movement) {
            case Movement.JumpLeft:
                this.startJump(this.movement);
                break;

            case Movement.JumpRight: 
                this.startJump(this.movement);
                break;

            case Movement.Left: 
                this.movePlayerLeft();
                break;
            
            case Movement.Right: 
                this.movePlayerRight();
                break;

            case Movement.IdleRight:
                this.idle(this.movement);
                break;

            case Movement.IdleLeft:
                this.idle(this.movement);
                break;
            
        }
            
    }
    
}