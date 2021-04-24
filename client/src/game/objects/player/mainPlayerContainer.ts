import Controls from "../controls";
import { Socket } from 'socket.io-client';
import { store } from '../../../store';
import Phaser from 'phaser';
import PlayerInfo from "../interfaces/playerInfo";
import Movement from "../enums/movement";
import Player from "./player";
import PlayerContainer from "./playerContainer";

export default class MainPlayerContainer extends PlayerContainer {
    public controls!: Controls;

    private socket: Socket;

    constructor (scene: Phaser.Scene, socket: Socket, player: Player, text: Phaser.GameObjects.Text, playerInfo: PlayerInfo ) {
        super(scene, player, text, playerInfo);
        this.socket = socket;
        this.initMainPlayer();
    }

    private addPlayerControls() {
        // Create controls
        this.controls = new Controls(this, this.socket);
        this.controls.createKeys();
    }

    private initMainPlayer() {
        const playerInfo: PlayerInfo = {
            playerId: this.socket.id,
            playerMovement: {
                previousMovement: Movement.None,
                currentMovement: Movement.None,
                x: this.x,
                y: this.y
            }
        }
        // Create player
        store.dispatch('playerModule/submitMainPlayerId', this.socket.id);
 
        store.dispatch('playerModule/submitAddPlayer', this);

        this.scene.add.existing(this);

        this.socket.emit('playerLocation', [playerInfo]);

        this.addPlayerControls();
    }
}