export default class MainPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor (scene: Phaser.Scene) {
        super(scene, 340, 0, 'bear');
        scene.physics.world.enable(this);
    }
    
    public movePlayerX(position: number) {
        this.setVelocity(position);
        this.anims.play({ key: 'walk-l', repeat: -1 });
    }
}