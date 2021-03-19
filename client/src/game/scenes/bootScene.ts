  
import { Scene } from 'phaser';

//SCENES - different areas of your game (ie different screens, rooms etc..)
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'bootScene' });
  }

  public preload () {
    // Character
    this.load.aseprite('bear', 'assets/bear-sprite.png', 'assets/bear-sprite.json');

    // Tileset
    this.load.image('nature-tileset',  'assets/nature-tileset.png');

    // Tilemap
    this.load.tilemapTiledJSON('tilemap', 'assets/nature-tilemap.json');
    
    // Main menu Background
    this.load.image('main-menu-background', 'assets/main-menu-background.png');

    // Main menu text
    this.load.image('menu-text', 'assets/menu-text.png');
    this.load.image('play-text', 'assets/play-text.png');
  }

  public create () {
    // Creates sprite animation using aesprite json
    this.anims.createFromAseprite('bear');

    // Starts the main menu on load
    this.scene.start('mainMenuScene');
  }
}