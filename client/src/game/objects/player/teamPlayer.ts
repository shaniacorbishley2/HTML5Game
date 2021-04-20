import Player from "./player";
import Movement from '../enums/movement'
import PlayerInfo from "../interfaces/playerInfo";

export default class TeamPlayer extends Player {

    public currentPlayerInfo: PlayerInfo;

    public newKeyPressed: boolean = false;

    constructor (scene: Phaser.Scene, playerInfo: PlayerInfo ) {
        super(scene, playerInfo.playerId);
        this.currentPlayerInfo = playerInfo;
    }

    public set newPlayerInfo(playerInfo: PlayerInfo) {
        this.currentPlayerInfo = playerInfo;
        this.newKeyPressed = false; 
    }

    public checkPlayerMovement() {
        switch(this.currentPlayerInfo.playerMovement?.currentMovement) { 
            case Movement.IdleRight:
                this.idle(this.currentPlayerInfo.playerMovement?.currentMovement);
                break;

            case Movement.IdleLeft:
                this.idle(this.currentPlayerInfo.playerMovement?.currentMovement);
                break;


            case Movement.JumpLeft:
                this.startJump(this.currentPlayerInfo.playerMovement?.currentMovement);
                break;

            case Movement.JumpRight: 
                this.startJump(this.currentPlayerInfo.playerMovement?.currentMovement);
                break;

            case Movement.Left: 
                this.movePlayerLeft();
                break;
            
            case Movement.Right: 
                this.movePlayerRight();
                break;
        }
            
    }
    
}