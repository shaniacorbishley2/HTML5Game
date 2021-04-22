import Controls from "./../controls";
import { Socket } from 'socket.io-client';
import { store } from '../../../store';
import Phaser from 'phaser';
import PlayerInfo from "../interfaces/playerInfo";
import Movement from "../enums/movement";
import Player from "./player";

export default class MainPlayer extends Player {
    public controls!: Controls;

    private socket: Socket;

    constructor (scene: Phaser.Scene, socket: Socket ) {
        super(scene, 
            {
                playerId: socket.id, 
                playerMovement:  {
                    currentMovement: Movement.None,
                    previousMovement: Movement.None,
                    x: 0,
                    y: 0
                }
            });

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

        this.scene.add.existing(this);
        
        store.dispatch('playerModule/submitAddPlayer', this);

        this.socket.emit('playerLocation', [playerInfo]);

        this.addPlayerControls();
    }
}