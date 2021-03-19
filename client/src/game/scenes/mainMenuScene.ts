import { Scene } from 'phaser';

export default class MainMenuScene extends Scene {
    constructor () {
        super({ key: 'mainMenuScene' });
    }

    public create() {
        // Add background
        this.add.image(0, 0, 'main-menu-background').setOrigin(0).setDepth(0);

        // Add text
        this.add.image(315, 60, 'menu-text');
        const playButton = this.add.image(315, 160, 'play-text');

        // Play Button logic
        playButton.setInteractive();
        
        // When the play button is pressed, start
        playButton.on('pointerdown', () => {
            this.scene.start('playScene');
            
        });
    }
}