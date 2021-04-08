import { store } from '../../store';
import Movements from './enums/movements';
export default class MainPlayer extends Phaser.Physics.Arcade.Sprite {

    private moveVelocity: number = 60;

    private jumpVelocity: number = -150;

    public playerId: string = '';

    public playerHealth: number = 100;

    constructor (scene: Phaser.Scene, playerId: string) {
        super(scene, 340, 0, 'bear');
        this.playerId = playerId;
        scene.physics.world.enable(this);
        this.setGravity(0, 5);
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
    public idle(direction: Movements) {
        this.setVelocityX(0);
        if (direction === Movements.Left || direction === Movements.SideJumpLeft) {
            this.anims.play('idle-l', true)
        }
        if (direction === Movements.Right || direction === Movements.SideJumpRight) {
            this.anims.play('idle-r', true);
        }
    }

    // Starts the jump 
    public startJump() {
        this.setVelocityY(this.jumpVelocity);
        this.anims.play('jump-l', true);
    }

    // Jump to the side
    public sideJump(direction: Movements) {
        this.setVelocityY(this.jumpVelocity);
        this.setVelocityX(direction === Movements.SideJumpLeft ? -10 : 10);
        direction === Movements.SideJumpLeft ? this.anims.play('jump-l', true) : this.anims.play('jump-r', true);
    }

    // Ends players jump
    public endJump() {
        this.setVelocityY(0);
    }

    // Sets hit box for the player to be exact pixel height
    public setCollisionBox() {
        this.body.setSize(16, 30, true);
    }

    public playerHit() {
        store.dispatch('playerModule/updateHealth', -10);
    }
}