import Controls from "./../controls";
import Player from "./player";
import { Socket } from 'socket.io-client';
import { store } from '../../../store';
import Phaser from 'phaser';
import PlayerInfo from "../interfaces/playerInfo";
import Movement from "../enums/movement";

export default class MainPlayer extends Player {
    public controls!: Controls;

    private socket: Socket;

    constructor (scene: Phaser.Scene, socket: Socket ) {
        super(scene, socket.id);
        this.socket = socket;
        this.initPlayer();
    }

    private addPlayerControls(player: Player) {
        // Create controls
        this.controls = new Controls(player, this.socket);
        this.controls.createKeys();
    }

    private initPlayer() {
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

        this.scene.add.existing(this);
        
        store.dispatch('playerModule/submitAddPlayer', this);

        this.socket.emit('playerLocation', [playerInfo]);

        this.addPlayerControls(this);
    }
}