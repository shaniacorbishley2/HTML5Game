export default class PlayerText extends Phaser.GameObjects.Text {
    constructor (scene: Phaser.Scene, text: string) {
        super(scene, 0, 0, text, {fontSize:'12px',color:'#fff',fontFamily: 'Arial'});
        this.setOrigin(0.25, 0.8);
    }
}