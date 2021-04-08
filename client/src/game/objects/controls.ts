import MainPlayer from './mainPlayer';
import Keys from './interfaces/keys';
import KeyPressed from '../enums/keyPressed';

export default class Controls {

    constructor(player: MainPlayer) {
        this.player = player;
    }
    public player: MainPlayer;

    private keys!: Keys;

    private lastKeyPressed: KeyPressed = KeyPressed.None;

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
            this.lastKeyPressed = KeyPressed.Left;
            this.player.sideJump('left');
        }

        if (this.keys.right.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.lastKeyPressed = KeyPressed.Right;
            this.player.sideJump('right');
        }

        if (this.keys.left.isDown) {
            this.lastKeyPressed = KeyPressed.Left;
            this.player.movePlayerLeft();
        }

        else if (this.keys.right.isDown) {
            this.lastKeyPressed = KeyPressed.Right;
            this.player.movePlayerRight();
        }

        else if (this.keys.up.isDown && this.player.body.blocked.down) {
            this.player.startJump();
        }

        else {
            this.player.idle(this.lastKeyPressed.valueOf() === KeyPressed.Left ? 'left' : 'right');
        }
    }
}