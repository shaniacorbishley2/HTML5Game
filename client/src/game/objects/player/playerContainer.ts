import Movement from "../enums/movement";
import PlayerInfo from "../interfaces/player/playerInfo";
export default class PlayerContainer extends Phaser.GameObjects.Container {

    public playerInfo: PlayerInfo;

    public text: Phaser.GameObjects.BitmapText;

    private player: Phaser.GameObjects.Sprite;

    private moveVelocity: number = 60;

    private jumpVelocity: number = -170;

    constructor (scene: Phaser.Scene, player: Phaser.GameObjects.Sprite, text: Phaser.GameObjects.BitmapText, playerInfo: PlayerInfo) {
        super(scene, 340, 49, [player, text]);
        this.scene = scene;
        this.player = player;
        this.playerInfo = playerInfo;
        this.text = text;
        this.initPlayerContainer();
    }

    public movePlayerLeft() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityX(-this.moveVelocity);
            this.player.anims.play('walk-l', true);
        }
    }

    // Move player right 
    public movePlayerRight() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityX(this.moveVelocity);
            this.player.anims.play('walk-r', true);
        }
    }

    // Player not moving, set to idle state
    public idle(direction: Movement) {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityX(0);
            if (direction === Movement.IdleLeft) {
                this.player.anims.play('idle-l', true);
            }
            else if (direction === Movement.IdleRight) {
                this.player.anims.play('idle-r', true);
            }
        }
    }

    // Starts the jump 
    public startJump(direction: Movement) {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityY(this.jumpVelocity);  
            if (direction === Movement.JumpLeft) {
                this.player.anims.play('jump-l', true);
            }
            if (direction === Movement.JumpRight) {
                this.player.anims.play('jump-r', true);
            }
        }
    }

    // Jump to the side
    public sideJumpRight() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setVelocityX(this.moveVelocity);
            this.player.anims.play('jump-r', true);
        }
    }

    public sideJumpLeft() {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setVelocityX(-this.moveVelocity);
            this.player.anims.play('jump-l', true);
        }

    }
    
    // Checks player movement, called continuously in update loop
    public checkPlayerMovement() {
        if (this.playerInfo.playerMovement && this.body instanceof Phaser.Physics.Arcade.Body) {
            
            if (this.playerInfo.playerMovement.currentMovement === Movement.SideJumpLeft && this.body.blocked.down) {
                this.sideJumpLeft();
            }
            
            else if (this.playerInfo.playerMovement.currentMovement === Movement.SideJumpRight && this.body.blocked.down) {
                this.sideJumpRight();
            }
            
            else if (this.playerInfo.playerMovement.currentMovement === Movement.Left) {
                this.playerInfo.playerMovement.currentMovement = Movement.Left;
                this.movePlayerLeft();
            }
    
            else if (this.playerInfo.playerMovement.currentMovement === Movement.Right) {
                this.playerInfo.playerMovement.currentMovement = Movement.Right;
                this.movePlayerRight();
            }
            
            else if ((this.playerInfo.playerMovement.currentMovement === Movement.JumpLeft || this.playerInfo.playerMovement.currentMovement === Movement.JumpRight) && this.body.blocked.down) {
                this.startJump(this.playerInfo.playerMovement.currentMovement);
            }
            
            else if (this.playerInfo.playerMovement.currentMovement === Movement.IdleLeft || this.playerInfo.playerMovement.currentMovement === Movement.IdleRight) {
                this.idle(this.playerInfo.playerMovement.currentMovement);
            }  
        }
    }

    public addToScene() {
        this.scene.add.existing(this);
    }

    private initPlayerContainer() {
        this.scene.physics.world.enableBody(this);
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setGravity(0, 5);
            this.body.setSize(16, 30, true);
            this.body.setCollideWorldBounds(true);
            this.body.setImmovable(true);
        }
    }
}