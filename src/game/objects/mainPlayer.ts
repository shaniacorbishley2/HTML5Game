export default class MainPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor (scene: Phaser.Scene) {
        super(scene, 200, 272, 'bear');
        scene.physics.world.enable(this);
    }
    
    public movePlayerX(position: number) {
        this.body.position.x = position;
    }
}