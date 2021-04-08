export default class Enermy extends Phaser.Physics.Arcade.Image {

    public enermyId: string = '';

    constructor (scene: Phaser.Scene, enermyId: string) {
        super(scene, 340, 0, 'bomb');
        this.enermyId = enermyId;
        this.initEnermy();
    }

    private initEnermy() {

        this.setScale(0.5);

        this.scene.physics.world.enable(this);

        this.setGravity(0, 5);

        this.setBounce(1);

        this.setVelocity(50, 20);

    }
}