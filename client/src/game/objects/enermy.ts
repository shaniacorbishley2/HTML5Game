export default class Enermy extends Phaser.Physics.Arcade.Group {

    public enermyId: string = '';

    public config

    constructor (world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, enermyId: string) {
        super(world, scene, {
            key: 'bomb',
            repeat: 5,
            setXY: { x: 300, y: 0, stepX: 20 },
            bounceX: 1,
            bounceY: 1,
            velocityX: 50,
            velocityY: 20,
            collideWorldBounds: true,
            setScale: {
                x: 0.5,
                y: 0.5
            },
        });

        this.enermyId = enermyId;
    }
}