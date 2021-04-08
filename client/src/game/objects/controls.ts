import MainPlayer from './mainPlayer';
import Keys from './interfaces/keys';
import Movements from './enums/movements';
import { io, Socket } from 'socket.io-client';

export default class Controls {

    constructor(player: MainPlayer, socket: Socket) {
        this.player = player;
        this.socket = socket;
    }
    public player: MainPlayer;

    private keys!: Keys;

    private socket!: Socket;

    private currentDirection: Movements = Movements.None;

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
            this.currentDirection = Movements.SideJumpLeft;

            this.player.sideJump(this.currentDirection);

            this.socket.emit('playerMoved', [this.player, this.currentDirection]);
        }

        if (this.keys.right.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.currentDirection = Movements.SideJumpRight;

            this.player.sideJump(this.currentDirection);

            this.socket.emit('playerMoved', [this.player, this.currentDirection]);
        }

        if (this.keys.left.isDown) {
            this.player.movePlayerLeft();

            this.currentDirection = Movements.Left;

            this.socket.emit('playerMoved', [this.player, this.currentDirection]);
        }

        else if (this.keys.right.isDown) {

            this.player.movePlayerRight();

            this.currentDirection = Movements.Right;


            this.socket.emit('playerMoved', [this.player, this.currentDirection]);
        }

        else if (this.keys.up.isDown && this.player.body.blocked.down) {
            this.player.startJump();

            this.socket.emit('playerMoved', [this.player, this.currentDirection]);
        }

        else {
            var idleDirection = Movements.None;

            if (this.currentDirection === Movements.Left || this.currentDirection === Movements.SideJumpLeft) {
                idleDirection = Movements.IdleLeft
                this.player.idle(idleDirection);
                this.socket.emit('playerMoved', [this.player, idleDirection]);
            }

            else if (this.currentDirection === Movements.Right || this.currentDirection === Movements.SideJumpRight) {
                idleDirection = Movements.IdleRight
                this.player.idle(idleDirection);
                this.socket.emit('playerMoved', [this.player, idleDirection]);
                
            }
        }
    }
}