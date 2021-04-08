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

    private lastKeyPressed: Movements = Movements.None;

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
            this.lastKeyPressed = Movements.SideJumpLeft;

            this.player.sideJump(this.lastKeyPressed);

            this.socket.emit('playerMoved', [this.player, 'side-jump-left']);
        }

        if (this.keys.right.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.lastKeyPressed = Movements.SideJumpRight;

            this.player.sideJump(this.lastKeyPressed);

            this.socket.emit('playerMoved', [this.player, 'side-jump-right']);
        }

        if (this.keys.left.isDown) {
            this.lastKeyPressed = Movements.Left;

            this.player.movePlayerLeft();

            this.socket.emit('playerMoved', [this.player, 'left']);
        }

        else if (this.keys.right.isDown) {
            this.lastKeyPressed = Movements.Right;

            this.player.movePlayerRight();

            this.socket.emit('playerMoved', [this.player, 'right']);
        }

        else if (this.keys.up.isDown && this.player.body.blocked.down) {
            this.player.startJump();

            this.socket.emit('playerMoved', [this.player, 'jump']);
        }

        else {
            this.player.idle(this.lastKeyPressed);

            this.socket.emit('playerMoved', [this.player, `idle-${this.lastKeyPressed}`]);
        }
    }
}