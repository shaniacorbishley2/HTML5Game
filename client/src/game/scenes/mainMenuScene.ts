import { Scene } from 'phaser';
import { io, Socket } from 'socket.io-client';
import { store } from '../../store'
import PlayerInfo from '../objects/interfaces/playerInfo';

export default class MainMenuScene extends Scene {
    private socket!: Socket;

    constructor () {
        super({ key: 'mainMenuScene' });
    }

    public create() {
        store.dispatch('playerModule/submitAddScene', this);

        this.scale.lockOrientation('landscape');

        //SOCKET IO - this would change to a live
        this.socket = io('10.106.101.12:3000');
        this.socket.on('connect', async () => {

            this.socket.on('playerDisconnected', (playersInfo: PlayerInfo[]) => {
                store.dispatch('playerModule/submitPlayerDisconnected', playersInfo);
            });
            
            // Add background
            this.add.image(0, 0, 'main-menu-background').setOrigin(0).setDepth(0);

            store.dispatch('gameObjectModule/submitFullscreenObject', this);

            
            
            // Add text
            this.add.image(315, 60, 'menu-text');
            const playButton: Phaser.GameObjects.Image = this.add.image(315, 210, 'play-text');

            // Play Button logic
            playButton.setInteractive();

            // When the play button is pressed, start
            playButton.on('pointerdown', () => {
                this.scene.start('playScene', {socket: this.socket});
                
            });
        });
    }
}