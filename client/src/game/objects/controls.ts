import Keys from './interfaces/keys';
import Movement from './enums/movement';
import { Socket } from 'socket.io-client';
import PlayerInfo from './interfaces/playerInfo';
import MainPlayer from './player/mainPlayer';

export default class Controls {

    constructor(player: MainPlayer, socket: Socket) {
        this.player = player;
        this.socket = socket;
    }
    public player: MainPlayer;
    
    private socket: Socket;

    private keys!: Keys;

    private previousMovement: Movement = Movement.None;

    private currentMovement: Movement = Movement.None;

    public createKeys() {

        this.keys = this.player.scene.input.keyboard.addKeys({
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
            right:  Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:  Phaser.Input.Keyboard.KeyCodes.UP,
            down:  Phaser.Input.Keyboard.KeyCodes.DOWN
        }) as Keys;
    }

    public checkControls() {
        this.previousMovement = this.currentMovement;
        
        if (this.keys.left.isDown) {
            if (this.keys.up.isUp) {
                this.currentMovement = Movement.Left;
                this.emitKeyPressed();
            }

            if (this.keys.up.isDown && this.player.body.blocked.down) {
                this.currentMovement = Movement.SideJumpLeft;
                this.emitKeyPressed();
            }

            

        }

        else if (this.keys.right.isDown) {
            if (this.keys.up.isUp) {
                this.currentMovement = Movement.Right;
                this.emitKeyPressed();
            }

            if (this.keys.up.isDown) {
                this.currentMovement = Movement.SideJumpRight;
                this.emitKeyPressed();
            }
        }

        else if (this.keys.up.isDown && this.player.body.blocked.down) {
            if (this.currentMovement === Movement.Left || this.currentMovement === Movement.SideJumpLeft || this.currentMovement === Movement.JumpLeft || this.currentMovement === Movement.IdleLeft) {
                this.currentMovement = Movement.JumpLeft;
            }

            if (this.currentMovement === Movement.Right || this.currentMovement === Movement.SideJumpRight || this.currentMovement === Movement.JumpRight || this.currentMovement === Movement.IdleRight) {
                this.currentMovement = Movement.JumpRight;
            }

            this.emitKeyPressed();
        }

        else {

            if (this.currentMovement === Movement.Left || this.currentMovement === Movement.SideJumpLeft || this.currentMovement === Movement.JumpLeft || this.currentMovement === Movement.IdleLeft) {
                this.currentMovement = Movement.IdleLeft
                this.emitKeyPressed();
            } 

            else if (this.currentMovement === Movement.Right || this.currentMovement === Movement.SideJumpRight || this.currentMovement === Movement.JumpRight || this.currentMovement === Movement.IdleRight) {
                this.currentMovement = Movement.IdleRight
                this.emitKeyPressed();
            }
        }    
    }

    private emitKeyPressed() {
        const playerInfo: PlayerInfo = { 
            playerId: this.player.playerId, 
            playerMovement : {
                x: this.player.x, 
                y: this.player.y,
                currentMovement: this.currentMovement,
                previousMovement: this.previousMovement
            }
        };

        if (this.currentMovement !== this.previousMovement) {
            this.socket.emit('playerKeyPressed', [playerInfo]);
        }
    }
}