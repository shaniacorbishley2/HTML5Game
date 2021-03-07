  
import { Scene } from 'phaser';

//SCENES - different areas of your game (ie different screens, rooms etc..)
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' });
  }

  preload () {
    debugger;

    //this.load.image('sky', 'assets/sky.png');

    this.load.aseprite('bear', 'assets/bear-sprite.png', 'assets/bear-sprite.json');

    this.load.image('nature-tileset',  'assets/nature-tileset.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/nature-tilemap.json');
  }

  create () {
    this.anims.createFromAseprite('bear');
    this.scene.start('PlayScene');
  }
}