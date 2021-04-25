import { Scene } from 'phaser';
import { io, Socket } from 'socket.io-client';
import { store } from '../../store'
export default class MainMenuScene extends Scene {
    private socket!: Socket;

    private playEnabled: boolean = true;

    private playButton!: Phaser.GameObjects.Image;

    private gameFullText!: Phaser.GameObjects.BitmapText;

    constructor () {
        super({ key: 'mainMenuScene' });
    }

    public create() {
        store.dispatch('playerModule/submitAddScene', this);

        this.scale.lockOrientation('landscape');

        //SOCKET IO - this would change to a live
        this.socket = io('10.106.101.12:3000');

        this.socket.on('connect', () => {
            // When the play button is pressed, start
            
            this.initMenu();
            
            this.createPlayButton();
            
            this.listeners();

            if (this.playEnabled && this.playButton) {
                this.add.existing(this.playButton);
            }
        });
    }

    private playButtonDisabled() {
        this.playEnabled = false
        this.playButton.setVisible(false);
        this.gameFullText = this.add.bitmapText(250, 210, 'minecraft', 'Game full, please wait...').setDepth(5).setTintFill(0xff6666);
    }

    private playButtonEnabled() {
        this.playEnabled = true;
        if (this.gameFullText) {
            this.gameFullText.setVisible(false);
        }
        if (!this.playButton.addedToScene) {
            this.add.existing(this.playButton);
        }
        this.playButton.setVisible(true);
    }

    private initMenu() {
        // Add background
        this.add.image(0, 0, 'main-menu-background').setOrigin(0).setDepth(0);

        store.dispatch('gameObjectModule/submitFullscreenObject', this);
        
        // Add text
        this.add.image(315, 60, 'menu-text');
    }

    private createPlayButton() {
        this.playButton = new Phaser.GameObjects.Image(this, 315, 210, 'play-text');
        // Play Button logic
        this.playButton.setInteractive();

        this.playButton.on('pointerdown', () => {
            this.scene.start('playScene', {socket: this.socket});
        
        });
    }

    private listeners() {
        this.socket.on('playDisabled', () => {
            this.playButtonDisabled();
        });

        this.socket.on('playEnabled', () => {
            this.playButtonEnabled();
        });
    }
}