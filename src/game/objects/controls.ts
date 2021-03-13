import MainPlayer from './mainPlayer';

export default class Controls {

    constructor(player: MainPlayer) {
        this.player = player;
        this.createControls();
    }
    public player: MainPlayer;

    public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    public createControls() {
        this.cursors = this.player.scene.input.keyboard.createCursorKeys();
    }

    public checkControls() {
        if (this.cursors.left.isDown) {
            //player method
            this.player.movePlayerX(100);
        }
    }
}