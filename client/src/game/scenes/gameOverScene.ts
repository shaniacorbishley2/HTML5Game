import { Scene } from 'phaser';
import { store } from '../../store'

//SCENES - different areas of your game (ie different screens, rooms etc..)
export default class GameOverScene extends Scene {
    constructor () {
        super({ key: 'gameOverScene' });
    }

    public create () {
        store.dispatch('playerModule/submitAddScene', this);

        this.add.image(0, 0, 'main-menu-background').setOrigin(0).setDepth(0);

        this.add.bitmapText(190, 130, 'minecraft', 'Game Over!').setDepth(5).setTintFill(0xff6666).setScale(3).setOrigin(0, 0);
    }
}