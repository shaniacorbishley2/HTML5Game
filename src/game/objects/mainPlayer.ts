export default class MainPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor (scene: Phaser.Scene) {
        super(scene, 340, 0, 'bear');
        scene.physics.world.enable(this);
        this.setGravity(0, 5);
    }

    public timer!: Phaser.Time.TimerEvent;

    public jumpPower: number = 0;
    
    // Move player left or right
    public movePlayerX(position: number) {
        this.setVelocityX(position);
        position < 0 ? this.anims.play('walk-l', true) : this.anims.play('walk-r', true);
    }

    // idle - player not moving
    public idle(direction: string) {
        this.setVelocityX(0);
        direction === 'left' ? this.anims.play('idle-l', true) : this.anims.play('idle-r', true);
    }

    // jump 
    public startJump(position: number) {
        this.timer = this.scene.time.addEvent({
            delay: 100,
            callback: this.increaseJumpPower,
            callbackScope: this,
            loop: true
        });

        this.setVelocityY(position + this.jumpPower);
        this.anims.play('jump-l', true);
    }

    public endJump() {
        this.timer.remove();
        this.jumpPower = 0;
    }

    public increaseJumpPower() {
        if (this.jumpPower > -5){
            this.jumpPower -=1;
        }
    }

    // Sets hit box for the player to be exact pixel height
    public setCollisionBox() {
        this.body.setSize(
            16, 30, true);
    }
}