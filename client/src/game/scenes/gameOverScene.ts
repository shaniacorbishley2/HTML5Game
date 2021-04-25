import { Scene } from 'phaser';
import { store } from '../../store'

// Scene called when the game timer ends, all players will get sent to this screen.
export default class GameOverScene extends Scene {
    constructor () {
        super({ key: 'gameOverScene' });
    }

    public create () {
        store.dispatch('playerModule/submitAddScene', this);

        this.add.image(0, 0, 'main-menu-background').setOrigin(0).setDepth(0);

        this.add.bitmapText(190, 130, 'minecraft', 'Game Over!').setDepth(5).setTintFill(0xff6666).setScale(3).setOrigin(0, 0);

        store.dispatch('gameObjectModule/submitFullscreenObject', this);
    }
}