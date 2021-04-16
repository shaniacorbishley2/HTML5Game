import Enermy from "./enermy";
import Phaser from 'phaser';
export default class EnermyGroup extends Phaser.Physics.Arcade.Group {

    constructor (world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupCreateConfig) {
        super(world, scene, config);
    }

    public addEnermies(enermies: Enermy[]) {
        this.addMultiple(enermies, true);
        this.setXY(300, 0, 20);
    }
}