import Movement from "../enums/movement";
import PlayerInfo from "../interfaces/playerInfo";
import Player from "./player";

export default class PlayerContainer extends Phaser.GameObjects.Container {

    public player: Player;
    
    public playerInfo: PlayerInfo;

    private moveVelocity: number = 60;

    private jumpVelocity: number = -170;

    constructor (scene: Phaser.Scene, player: Player, text: Phaser.GameObjects.Text, playerInfo: PlayerInfo) {
        super(scene, 340, 49, [player, text]);
        this.scene = scene;
        this.player = player;
        this.playerInfo = playerInfo;
        this.initPlayerContainer();
    }

    public movePlayerLeft() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityX(-this.moveVelocity);
            this.player.movePlayerLeftAnims();
        }
    }

    // Move player right 
    public movePlayerRight() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityX(this.moveVelocity);
            this.player.movePlayerRightAnims();
        }
    }

    // Player not moving, set to idle state
    public idle(direction: Movement) {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityX(0);
            this.player.idleAnims(direction);
        }
    }

    // Starts the jump 
    public startJump(direction: Movement) {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityY(this.jumpVelocity);  
            this.player.startJumpAnims(direction);
        }
    }

    // Jump to the side
    public sideJumpRight() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setVelocityX(this.moveVelocity);
            this.player.sideJumpRightAnims();
        }
    }

    public sideJumpLeft() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setVelocityX(-this.moveVelocity);
            this.player.sideJumpLeftAnims();
        }

    }
    
    public checkPlayerMovement() {
        if (this.playerInfo.playerMovement && this.body instanceof Phaser.Physics.Arcade.Body) {
            
            if (this.playerInfo.playerMovement.currentMovement === Movement.SideJumpLeft && this.body.blocked.down) {
                this.sideJumpLeft();
            }
            
            else if (this.playerInfo.playerMovement.currentMovement === Movement.SideJumpRight && this.body.blocked.down) {
                this.sideJumpRight();
            }
            
            else if (this.playerInfo.playerMovement.currentMovement === Movement.Left) {
                this.playerInfo.playerMovement.currentMovement = Movement.Left;
                this.movePlayerLeft();
            }
    
            else if (this.playerInfo.playerMovement.currentMovement === Movement.Right) {
                this.playerInfo.playerMovement.currentMovement = Movement.Right;
                this.movePlayerRight();
            }
            
            else if ((this.playerInfo.playerMovement.currentMovement === Movement.JumpLeft || this.playerInfo.playerMovement.currentMovement === Movement.JumpRight) && this.body.blocked.down) {
                this.startJump(this.playerInfo.playerMovement.currentMovement);
            }
            
            else if (this.playerInfo.playerMovement.currentMovement === Movement.IdleLeft || this.playerInfo.playerMovement.currentMovement === Movement.IdleRight) {
                this.idle(this.playerInfo.playerMovement.currentMovement);
            }  
        }
    }

    public addToScene() {
        this.scene.add.existing(this);
    }

    private initPlayerContainer() {
        this.scene.physics.world.enableBody(this);
        if (this.playerInfo.playerMovement && this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setGravity(0, 5);
            this.body.setSize(16, 30, true);
            this.body.setCollideWorldBounds(true);
            this.body.setImmovable(true);
        }
    }
}