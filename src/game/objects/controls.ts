import MainPlayer from './mainPlayer';
import Keys from './interfaces/keys';

export default class Controls {

    constructor(player: MainPlayer) {
        this.player = player;
    }
    public player: MainPlayer;

    private keys!: Keys;

    public createKeys() {

        this.keys = this.player.scene.input.keyboard.addKeys({
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
            right:  Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:  Phaser.Input.Keyboard.KeyCodes.UP,
            down:  Phaser.Input.Keyboard.KeyCodes.DOWN
        }) as Keys;

        console.log(this.keys);
    }

    public checkControls() {

        if (this.keys.left.isDown) {
            this.player.movePlayerX(-60);
        }

        else if (this.keys.right.isDown) {
            this.player.movePlayerX(60);
        }

        else if (this.keys.up.isDown) {
            this.player.startJump(-60);
        }

        else {
            this.player.idle('left');
        }
    }
}