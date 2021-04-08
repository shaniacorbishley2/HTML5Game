import MainPlayer from './mainPlayer';
import Keys from './interfaces/keys';
import KeyPressed from './enums/keyPressed';

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
            this.player.sideJump('left');
            this.lastKeyPressed = KeyPressed.Left;
        }

        if (this.keys.right.isDown && this.keys.up.isDown && this.player.body.blocked.down) {
            this.player.sideJump('right');
            this.lastKeyPressed = KeyPressed.Right;
        }

        if (this.keys.left.isDown) {
            this.player.movePlayerLeft();
            this.lastKeyPressed = KeyPressed.Left;
        }

        else if (this.keys.right.isDown) {
            this.player.movePlayerRight();
            this.lastKeyPressed = KeyPressed.Right;
        }

        else if (this.keys.up.isDown && this.player.body.blocked.down) {
            this.player.startJump();
        }

        else {
            this.player.idle(this.lastKeyPressed.toString());
        }
    }
}