  
import { Scene } from 'phaser';
import { store } from '../../store'

//SCENES - different areas of your game (ie different screens, rooms etc..)
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'bootScene' });
  }

  public preload () {
    store.dispatch('playerModule/submitAddScene', this);

    // Character
    this.load.aseprite('bear', 'assets/bear-sprite.png', 'assets/bear-sprite.json');

    // Tileset
    this.load.image('nature-tileset',  'assets/nature-tileset.png');

    // Bomb - enermy 1
    this.load.image('bomb', 'assets/bomb.png');

    // Collectable gems
    this.load.image('red-gem', 'assets/red-gem.png');
    this.load.image('yellow-gem', 'assets/yellow-gem.png');

    this.load.image('fullscreen', 'assets/fullscreen.png');

    // Tilemap
    this.load.tilemapTiledJSON('tilemap', 'assets/nature-tilemap.json');
    
    // Main menu Background
    this.load.image('main-menu-background', 'assets/main-menu-background.png');

    // Main menu text
    this.load.image('menu-text', 'assets/menu-text.png');
    this.load.image('play-text', 'assets/play-text.png');
  }
  

  public create () {
    this.scale.lockOrientation('landscape');
    // Creates sprite animation using aesprite json
    this.anims.createFromAseprite('bear');

    // Starts the main menu on load
    this.scene.start('mainMenuScene');
  }
}