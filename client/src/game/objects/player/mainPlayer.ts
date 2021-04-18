import Controls from "./../controls";
import Player from "./player";
import { Socket } from 'socket.io-client';
import { store } from '../../../store';
import Phaser from 'phaser';

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
        // Create player
        store.dispatch('playerModule/submitMainPlayerId', this.socket.id);

        this.scene.add.existing(this);
        
        store.dispatch('playerModule/submitAddPlayer', this);
        this.addPlayerControls(this);
        //this.socketIds.push(playerId);
    }
}