import { store } from '../../../store';
import Movement from './../enums/movement';
import Phaser from 'phaser';
import PlayerHealth from './../interfaces/playerHealth';
export default class Player extends Phaser.GameObjects.Sprite {

    public playerHealth: number = 100;

    public playerName: string = 'player';

    private playerId: string;

    constructor (scene: Phaser.Scene, playerId: string) {
        super(scene, 0, -1, 'bear');
        this.playerId = playerId;
        this.setOrigin(0.25, 0);

    }

    // Move player left 
    public movePlayerLeftAnims() {
        this.anims.play('walk-l', true);
    }

    // Move player right 
    public movePlayerRightAnims() {
        this.anims.play('walk-r', true);
    }

    // Player not moving, set to idle state
    public idleAnims(direction: Movement) {
        if (direction === Movement.IdleLeft) {
            this.anims.play('idle-l', true)
        }
        else if (direction === Movement.IdleRight) {
            this.anims.play('idle-r', true);
        }
    }

    // Starts the jump 
    public startJumpAnims(direction: Movement) {
        if (direction === Movement.JumpLeft) {
            this.anims.play('jump-l', true);
        }
        if (direction === Movement.JumpRight) {
            this.anims.play('jump-r', true);
        }
    }

    // Jump to the side
    public sideJumpRightAnims() {
        this.anims.play('jump-r', true);
    }

    public sideJumpLeftAnims() {
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
}