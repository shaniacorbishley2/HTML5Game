import { store } from '../../../store';
import Movement from './../enums/movement';
import Phaser from 'phaser';
import PlayerHealth from './../interfaces/playerHealth';
export default class Player extends Phaser.Physics.Arcade.Sprite {
    public playerId: string = '';

    public playerHealth: number = 100;

    public currentMovement: Movement | null = Movement.None;

    public previousMovement: Movement | null = Movement.None;

    private moveVelocity: number = 60;

    private jumpVelocity: number = -150;

    constructor (scene: Phaser.Scene, playerId: string) {
        super(scene, 340, 49, 'bear');
        this.playerId = playerId;
        this.scene.physics.world.enable(this);
        this.setGravity(0, 5);
        this.setCollisionBox();
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
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

    public endJump() {
        this.setVelocityY(0);
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

    // Sets hit box for the player to be exact pixel height
    public setCollisionBox() {
        this.body.setSize(16, 30, true);
    }

    public playerHit() {
        const playerHealth: PlayerHealth = {
            playerId: this.playerId,
            health: -10
        }
        store.dispatch('playerModule/updateHealth', playerHealth);
    }

    public checkPlayerMovement() {
        if (this.currentMovement === Movement.SideJumpLeft && this.body.blocked.down) {
            this.sideJumpLeft();
        }

        else if (this.currentMovement === Movement.SideJumpRight && this.body.blocked.down) {
            this.sideJumpRight();
        }

        else if (this.currentMovement === Movement.Left) {
            this.currentMovement = Movement.Left;
            this.movePlayerLeft();
        }

        else if (this.currentMovement === Movement.Right) {
            this.currentMovement = Movement.Right;
            this.movePlayerRight();
        }

        else if ((this.currentMovement === Movement.JumpLeft || this.currentMovement === Movement.JumpRight) && this.body.blocked.down) {
            this.startJump(this.currentMovement);
        }

        else if (this.currentMovement === Movement.IdleLeft || this.currentMovement === Movement.IdleRight) {
                this.idle(this.currentMovement);
            }  
    }
}