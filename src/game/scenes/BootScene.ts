  
import { Scene } from 'phaser';

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' });
  }

  preload () {
    debugger;

    this.load.image('sky', 'assets/sky.png');

    this.load.aseprite('bear', 'assets/bear-sprite.png', 'assets/bear-sprite.json');
  }

  create () {
    this.anims.createFromAseprite('bear');
    this.scene.start('PlayScene');
  }
}