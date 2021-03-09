import { Scene } from 'phaser';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'playScene' });
  }

  create () {
    const map = this.make.tilemap({ key: 'tilemap' });

    const tileset = map.addTilesetImage('nature-tileset');

    map.createLayer('Sky', tileset);
    map.createLayer('Details', tileset);
    map.createLayer('Platform-1', tileset);
    map.createLayer('Platform-2', tileset);
    map.createLayer('Platform-3', tileset);
    map.createLayer('Platform-4', tileset);
    map.createLayer('Platform-5', tileset);
    map.createLayer('Platform-6', tileset);

    this.add.sprite(200, 272, 'bear').play({ key: 'walk-r', repeat: -1 });
  }
  
  update () {
    // update
  }

  intervalCallback () {
    // store.commit('setPosition', {x:Math.round(this.bomb.x), y:Math.round(this.bomb.y)});
  }

}