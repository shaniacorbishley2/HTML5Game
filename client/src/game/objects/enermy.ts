import Phaser from 'phaser';
export default class Enermy extends Phaser.GameObjects.Image {

    constructor (scene: Phaser.Scene, texture: string) {
        super(scene, 0, 0, texture);
        this.scene.physics.world.enable(this);
    }
}