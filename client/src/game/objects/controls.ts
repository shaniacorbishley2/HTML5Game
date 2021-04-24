import Keys from './interfaces/keys';
import Movement from './enums/movement';
import { Socket } from 'socket.io-client';
import PlayerInfo from './interfaces/playerInfo';
import MainPlayerContainer from './player/mainPlayerContainer';

export default class Controls {

    constructor(mainPlayerContainer: MainPlayerContainer, socket: Socket) {
        this.mainPlayerContainer = mainPlayerContainer;
        this.socket = socket;
    }
    public mainPlayerContainer: MainPlayerContainer;
    
    private socket: Socket;

    private keys!: Keys;

    private previousMovement: Movement = Movement.None;

    private currentMovement: Movement = Movement.None;

    public createKeys() {

        this.keys = this.mainPlayerContainer.scene.input.keyboard.addKeys({
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
            right:  Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up:  Phaser.Input.Keyboard.KeyCodes.UP,
            down:  Phaser.Input.Keyboard.KeyCodes.DOWN
        }) as Keys;
    }

    public checkControls() {
        this.previousMovement = this.currentMovement;

        if (this.mainPlayerContainer.body instanceof Phaser.Physics.Arcade.Body) {

            if (this.keys.left.isDown) {
                if (this.keys.up.isUp) {
                    this.currentMovement = Movement.Left;
                    this.emitKeyPressed();
                }
    
                if (this.keys.up.isDown && this.mainPlayerContainer.body.blocked.down) {
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
    
            else if (this.keys.up.isDown && this.mainPlayerContainer.body.blocked.down) {
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
    }

    private emitKeyPressed() {
        if (this.mainPlayerContainer.body instanceof Phaser.Physics.Arcade.Body) {
            const playerInfo: PlayerInfo = { 
                playerId: this.mainPlayerContainer.playerInfo.playerId, 
                playerMovement : {
                    x: this.mainPlayerContainer.x, 
                    y: this.mainPlayerContainer.y,
                    currentMovement: this.currentMovement,
                    previousMovement: this.previousMovement
                },
                health: this.mainPlayerContainer.playerInfo.health
            };

            if (this.currentMovement !== this.previousMovement) {
                this.socket.emit('playerKeyPressed', [playerInfo]);
            }
        }
    }
}