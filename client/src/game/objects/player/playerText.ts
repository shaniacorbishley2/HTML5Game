export default class PlayerText extends Phaser.GameObjects.BitmapText {
    constructor (scene: Phaser.Scene, text: string) {
        super(scene, 0, 0, 'minecraft', text);
        this.setOrigin(0.25, 0.8);
        this.setScale(0.5);
    }
}