  
import { Scene } from 'phaser'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    debugger;
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bomb', 'assets/bomb.png');
  }

  create () {
    this.scene.start('PlayScene')
  }
}