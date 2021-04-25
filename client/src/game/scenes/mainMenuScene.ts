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

        //SOCKET IO - this would change to a live link in the possible future
        this.socket = io('10.106.101.12:3000');

        // When socket connects
        this.socket.on('connect', () => {

            store.dispatch('playerModule/submitMainPlayerId', this.socket.id);
            
            this.initMenu();
            
            this.createPlayButton();
            
            this.listeners();

            if (this.playEnabled && this.playButton) {
                this.add.existing(this.playButton);
            }
        });
    }

    // Stops users from clicking play when the game is in progress
    private playButtonDisabled() {
        this.playEnabled = false
        this.playButton.setVisible(false);
        this.gameFullText = this.add.bitmapText(230, 210, 'minecraft', 'Game in progress, please wait...').setDepth(5).setTintFill(0xff6666);
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

        // Add fullscreen object to scene, allows user to enter full screen on click, not supported on iPhone.
        store.dispatch('gameObjectModule/submitFullscreenObject', this);
        
        // Add text
        this.add.image(315, 60, 'menu-text');
    }

    private createPlayButton() {
        this.playButton = new Phaser.GameObjects.Image(this, 315, 210, 'play-text');
        // Play Button logic
        this.playButton.setInteractive();

        // When the play button is pressed, start
        this.playButton.on('pointerdown', () => {
            this.scene.start('playScene', {socket: this.socket});
        
        });
    }

    // Listen for socket events
    private listeners() {
        this.socket.on('playDisabled', () => {
            this.playButtonDisabled();
        });

        this.socket.on('playEnabled', () => {
            this.playButtonEnabled();
        });
    }
}