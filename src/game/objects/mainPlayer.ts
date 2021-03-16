export default class MainPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor (scene: Phaser.Scene) {
        super(scene, 340, 0, 'bear');
        scene.physics.world.enable(this);
        this.setGravity(0, 5);
    }
    
    public movePlayerX(position: number) {
        this.setVelocityX(position);
        this.anims.play('walk-l', true);
    }

    public idle() {
        //this.anims.play({key: 'idle-l', repeat: -1});
    }

    public resetAnims() {

    }
}