import Player from '../objects/player/player';
import Keys from './interfaces/keys';
import Movement from './enums/movement';
import { Socket } from 'socket.io-client';
import PlayerMovement from './interfaces/playerMovement';

export default class Controls {

    constructor(player: Player, socket: Socket) {
        this.player = player;
        this.socket = socket;
    }
    public player: Player;

    private keys!: Keys;

    private socket!: Socket;

    private previousMovement: Movement = Movement.None;

    private currentMovement: Movement = Movement.None;

    public createKeys() {

        this.keys = this.player.scene.input.keyboard.addKeys({
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
            right:  Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:  Phaser.Input.Keyboard.KeyCodes.UP,
            down:  Phaser.Input.Keyboard.KeyCodes.DOWN
        }) as Keys;
    }

    public checkControls() {
        this.previousMovement = this.currentMovement;

        if (this.keys.left.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.currentMovement = Movement.SideJumpLeft;

            this.player.sideJump(this.currentMovement);

            this.emitKeyPressed();
            

        }

        if (this.keys.right.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.currentMovement = Movement.SideJumpRight;
            
            this.player.sideJump(this.currentMovement);

            this.emitKeyPressed();

        }

        if (this.keys.left.isDown) {
            this.currentMovement = Movement.Left;

            this.player.movePlayerLeft();

            this.emitKeyPressed();

        }

        else if (this.keys.right.isDown) {
            this.currentMovement = Movement.Right;

            this.player.movePlayerRight();

            this.emitKeyPressed();

        }

        else if (this.keys.up.isDown && this.player.body.blocked.down) {
            if (this.currentMovement === Movement.Left || this.currentMovement === Movement.SideJumpLeft || this.currentMovement === Movement.JumpLeft || this.currentMovement === Movement.IdleLeft) {
                this.currentMovement = Movement.JumpLeft;
            }

            if (this.currentMovement === Movement.Right || this.currentMovement === Movement.SideJumpRight || this.currentMovement === Movement.JumpRight || this.currentMovement === Movement.IdleRight) {
                this.currentMovement = Movement.JumpRight;
            }

            this.player.startJump(this.currentMovement);

            this.emitKeyPressed();
        }

        else {

            if (this.currentMovement === Movement.Left || this.currentMovement === Movement.SideJumpLeft || this.currentMovement === Movement.JumpLeft || this.currentMovement === Movement.IdleLeft) {
                this.currentMovement = Movement.IdleLeft
            }

            else if (this.currentMovement === Movement.Right || this.currentMovement === Movement.SideJumpRight || this.currentMovement === Movement.JumpRight || this.currentMovement === Movement.IdleRight) {
                this.currentMovement = Movement.IdleRight
            }

            this.player.idle(this.currentMovement);

            this.emitKeyPressed();

        }

        this.checkReleased();
    }

    private emitKeyPressed() {
        const playerMovement: PlayerMovement = { 
            playerId: this.player.playerId, 
            x: this.player.x, 
            y: this.player.y, 
            currentMovement: this.currentMovement, 
            previousMovement: this.previousMovement
        };

        if (this.currentMovement !== this.previousMovement) {
            this.socket.emit('playerKeyPressed', [playerMovement]);
        }
    }

    private checkReleased() {
        if ((this.previousMovement !== this.currentMovement) && this.previousMovement !== Movement.IdleLeft && this.previousMovement !== Movement.IdleRight && this.previousMovement !== Movement.None) {
            console.log('key released client');
            this.emitKeyReleased();
        }
    }

    private emitKeyReleased() {
        const playerMovement: PlayerMovement = { 
            playerId: this.player.playerId, 
            x: this.player.x, 
            y: this.player.y, 
            currentMovement: this.currentMovement, 
            previousMovement: this.previousMovement
        };

        this.socket.emit('playerKeyReleased', playerMovement);
    }
}