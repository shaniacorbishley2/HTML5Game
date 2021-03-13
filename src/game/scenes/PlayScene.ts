import { Scene } from 'phaser';
import Controls from '../objects/controls';
import MainPlayer from '../objects/mainPlayer';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'playScene' });
  }
  public player1!: MainPlayer;

  public controls!: Controls;
  create () {
    const map = this.make.tilemap({ key: 'tilemap' });

    const tileset = map.addTilesetImage('nature-tileset');

    // Init tileset
    map.createLayer('Sky', tileset);
    map.createLayer('Details', tileset);
    map.createLayer('Platform-1', tileset);
    map.createLayer('Platform-2', tileset);
    map.createLayer('Platform-3', tileset);
    map.createLayer('Platform-4', tileset);
    map.createLayer('Platform-5', tileset);
    map.createLayer('Platform-6', tileset);
    
    // Create player
    this.player1 = new MainPlayer(this); //this.player1 = this.add.sprite(200, 272, 'bear').play({ key: 'walk-r', repeat: -1 });
    
    // Add Player
    this.add.existing(this.player1);

    this.controls = new Controls(this.player1);

  }
  
  update () {
    // update
    this.controls.checkControls();

  }

  intervalCallback () {
    // store.commit('setPosition', {x:Math.round(this.bomb.x), y:Math.round(this.bomb.y)});
  }

}