import Phaser from 'phaser';
export default class EnermyGroup extends Phaser.Physics.Arcade.Group {
    public randomDataGenerator;
    
    constructor (world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupCreateConfig, randomDataGenerator: Phaser.Math.RandomDataGenerator) {
        super(world, scene, config);
        this.randomDataGenerator = randomDataGenerator;
    }

    public addEnermies(enermies: Phaser.GameObjects.Image[]) {
        this.addMultiple(enermies, true);
        this.setEnermyVelocity();
        this.children.each((child) => {
            child.body.position.x =  this.randomDataGenerator.integerInRange(100, 200);
    
        });
    }

    public setEnermyVelocity() {
        this.setVelocity(this.randomDataGenerator.integerInRange(100, 200), 50, 10);
    }
}