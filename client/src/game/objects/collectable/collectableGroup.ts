export default class CollectableGroup extends Phaser.Physics.Arcade.Group {
    public randomDataGenerator;
    
    constructor (world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupCreateConfig, randomDataGenerator: Phaser.Math.RandomDataGenerator) {
        super(world, scene, config);
        this.randomDataGenerator = randomDataGenerator;
    }

    public addCollectables(collectables: Phaser.GameObjects.Image[]) {
        this.addMultiple(collectables, true);
        // this.children.each((child) => {
        //     child.body.position.x =  this.randomDataGenerator.integerInRange(100, 200);
        // });
    }
}