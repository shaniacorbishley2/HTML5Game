import Phaser from 'phaser';
export default class Enermy extends Phaser.GameObjects.Image {

    constructor (scene: Phaser.Scene, texture: string, x: number ) {
        super(scene, x, 0, texture);
        this.scene.physics.world.enable(this);
        this.setScale(0.5);
    }
}