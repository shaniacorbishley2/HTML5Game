import MainPlayer from './mainPlayer';
import Keys from './interfaces/keys';
import Movement from './enums/movement';
import { Socket } from 'socket.io-client';

export default class Controls {

    constructor(player: MainPlayer, socket: Socket) {
        this.player = player;
        this.socket = socket;
    }
    public player: MainPlayer;

    private keys!: Keys;

    private socket!: Socket;

    private previousDirection: Movement = Movement.None;

    private currentDirection: Movement = Movement.None;

    public createKeys() {

        this.keys = this.player.scene.input.keyboard.addKeys({
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
            right:  Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:  Phaser.Input.Keyboard.KeyCodes.UP,
            down:  Phaser.Input.Keyboard.KeyCodes.DOWN
        }) as Keys;
    }

    public checkControls() {

        if (this.keys.left.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.currentDirection = Movement.SideJumpLeft;
            
            this.player.sideJump(this.currentDirection);

            this.emitMoved(this.player, this.currentDirection);

            this.previousDirection = this.currentDirection;

        }

        if (this.keys.right.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.currentDirection = Movement.SideJumpRight;
            
            this.player.sideJump(this.currentDirection);

            this.emitMoved(this.player, this.currentDirection);

            this.previousDirection = this.currentDirection;
        }

        if (this.keys.left.isDown) {
            this.currentDirection = Movement.Left;

            this.player.movePlayerLeft();

            this.emitMoved(this.player, this.currentDirection);

            this.previousDirection = this.currentDirection;
        }

        else if (this.keys.right.isDown) {
            this.currentDirection = Movement.Right;

            this.player.movePlayerRight();

            this.emitMoved(this.player, this.currentDirection);

            this.previousDirection = this.currentDirection;

        }

        else if (this.keys.up.isDown && this.player.body.blocked.down) {
            if (this.previousDirection === Movement.Left || this.previousDirection === Movement.SideJumpLeft || this.previousDirection === Movement.JumpLeft || this.previousDirection === Movement.IdleLeft) {
                this.currentDirection = Movement.JumpLeft;
            }

            if (this.previousDirection === Movement.Right || this.previousDirection === Movement.SideJumpRight || this.previousDirection === Movement.JumpRight || this.previousDirection === Movement.IdleRight) {
                this.currentDirection = Movement.JumpRight;
            }

            this.player.startJump(this.currentDirection);

            this.emitMoved(this.player, this.currentDirection);

            this.previousDirection = this.currentDirection;
        }

        else {

            if (this.previousDirection === Movement.Left || this.previousDirection === Movement.SideJumpLeft || this.previousDirection === Movement.JumpLeft || this.previousDirection === Movement.IdleLeft) {
                this.currentDirection = Movement.IdleLeft
            }

            else if (this.previousDirection === Movement.Right || this.previousDirection === Movement.SideJumpRight || this.previousDirection === Movement.JumpRight || this.previousDirection === Movement.IdleRight) {
                this.currentDirection = Movement.IdleRight
            }

            this.player.idle(this.currentDirection);

            this.emitMoved(this.player, this.currentDirection);

            this.previousDirection = this.currentDirection;
        }
    }

    private emitMoved(player: MainPlayer, direction: Movement) {
        if (this.currentDirection !== this.previousDirection) {
            this.socket.emit('playerMoved', [player.playerId, direction]);
        }
    }
}