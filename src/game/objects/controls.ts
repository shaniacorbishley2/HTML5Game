import MainPlayer from './mainPlayer';

export default class Controls {

    constructor(player: MainPlayer) {
        this.player = player;
    }
    public player: MainPlayer;

    public addControlListeners() {
        this.player.scene.input.keyboard.on('keydown-LEFT', () => {
            this.player.movePlayerX(-60);
        });
    }
}