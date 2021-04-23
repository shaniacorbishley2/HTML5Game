import { store } from '../../../store';
import Movement from './../enums/movement';
import Phaser from 'phaser';
import PlayerHealth from './../interfaces/playerHealth';
import PlayerInfo from '../interfaces/playerInfo';
import PlayerMovement from '../interfaces/playerMovement';
export default class Player extends Phaser.Physics.Arcade.Sprite {
    public playerId: string;

    public playerHealth: number = 100;

    public playerMovement: PlayerMovement;

    private moveVelocity: number = 60;

    private jumpVelocity: number = -170;

    constructor (scene: Phaser.Scene, playerInfo: PlayerInfo) {
        super(scene, 340, 49, 'bear');
        this.playerId = playerInfo.playerId;
        this.playerMovement = playerInfo.playerMovement;

        this.initPlayer();
    }

    // Move player left 
    public movePlayerLeft() {
        this.setVelocityX(-this.moveVelocity);
        this.anims.play('walk-l', true);
    }

    // Move player right 
    public movePlayerRight() {
        this.setVelocityX(this.moveVelocity);
        this.anims.play('walk-r', true);
    }

    // Player not moving, set to idle state
    public idle(direction: Movement) {
        this.setVelocityX(0);
        if (direction === Movement.IdleLeft) {
            this.anims.play('idle-l', true)
        }
        else if (direction === Movement.IdleRight) {
            this.anims.play('idle-r', true);
        }
    }

    // Starts the jump 
    public startJump(direction: Movement) {
        this.setVelocityY(this.jumpVelocity);

        if (direction === Movement.JumpLeft) {
            this.anims.play('jump-l', true);
        }
        if (direction === Movement.JumpRight) {
            this.anims.play('jump-r', true);
        }
        
    }

    // Jump to the side
    public sideJumpRight() {
        this.setVelocityY(this.jumpVelocity);
        this.setVelocityX(this.moveVelocity);
        this.anims.play('jump-r', true);
    }

    public sideJumpLeft() {
        this.setVelocityY(this.jumpVelocity);
        this.setVelocityX(-this.moveVelocity);
        this.anims.play('jump-l', true);

    }
    
    public removeHealth() {
        const playerHealth: PlayerHealth = {
            playerId: this.playerId,
            health: -10
        }
        store.dispatch('playerModule/submitUpdateHealth', playerHealth);
    }

    public addHealth() {
        const playerHealth: PlayerHealth = {
            playerId: this.playerId,
            health: 10
        }
        store.dispatch('playerModule/submitUpdateHealth', playerHealth);
    }
    
    public checkPlayerMovement() {
        if (this.playerMovement) {
            
            if (this.playerMovement.currentMovement === Movement.SideJumpLeft && this.body.blocked.down) {
                this.sideJumpLeft();
            }
            
            else if (this.playerMovement.currentMovement === Movement.SideJumpRight && this.body.blocked.down) {
                this.sideJumpRight();
            }
            
            else if (this.playerMovement.currentMovement === Movement.Left) {
                this.playerMovement.currentMovement = Movement.Left;
                this.movePlayerLeft();
            }
    
            else if (this.playerMovement.currentMovement === Movement.Right) {
                this.playerMovement.currentMovement = Movement.Right;
                this.movePlayerRight();
            }
            
            else if ((this.playerMovement.currentMovement === Movement.JumpLeft || this.playerMovement.currentMovement === Movement.JumpRight) && this.body.blocked.down) {
                this.startJump(this.playerMovement.currentMovement);
            }
            
            else if (this.playerMovement.currentMovement === Movement.IdleLeft || this.playerMovement.currentMovement === Movement.IdleRight) {
                this.idle(this.playerMovement.currentMovement);
            }  
        }
    }

    public addToScene() {
        store.dispatch('playerModule/submitAddPlayer', this);
        this.scene.add.existing(this);
        
    
        // const text = this.add.text(player.x, player.y,'player',{
        //   fontFamily:'Arial',
        //   color:'#000000',
        //   align:'center',
        // }).setFontSize(18);
    
        // this.add.container(200, 49,[player, text]);
    }

    private initPlayer() {
        this.scene.physics.world.enable(this);
        this.setGravity(0, 5);
        this.setCollisionBox();
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
    }

    // Sets hit box for the player to be exact pixel height
    private setCollisionBox() {
        this.body.setSize(16, 30, true);
    }
}