export default class MainPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor (scene: Phaser.Scene) {
        super(scene, 340, 0, 'bear');
        scene.physics.world.enable(this);
        this.setGravity(0, 5);
    }

    // Move player left or right
    public movePlayerX(position: number) {
        this.setVelocityX(position);
        position < 0 ? this.anims.play('walk-l', true) : this.anims.play('walk-r', true);
    }

    // Player not moving, set to idle state
    public idle(direction: string) {
        this.setVelocityX(0);
        direction === 'left' ? this.anims.play('idle-l', true) : this.anims.play('idle-r', true);
    }

    // Starts the jump 
    public startJump() {
        this.setVelocityY(-100);
        this.anims.play('jump-l', true);
    }

    // Jump to the side
    public sideJump(direction: string) {
        this.setVelocityY(-60);
        this.setVelocityX(direction === 'left' ? -10 : 10);
        direction === 'left' ? this.anims.play('jump-l', true) : this.anims.play('jump-r', true);
    }

    // Ends players jump
    public endJump() {
        this.setVelocityY(0);
    }

    // Sets hit box for the player to be exact pixel height
    public setCollisionBox() {
        this.body.setSize(
            16, 30, true);
    }
}