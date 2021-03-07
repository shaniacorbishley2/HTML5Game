import { Scene } from 'phaser';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' });
  }

  create () {
    this.add.image(400, 300, 'sky');
    debugger;
    this.add.sprite(400, 300, 'bear').play({ key: 'walk-r', repeat: -1 }).setScale(10);
  }
  
  update () {
    // update
  }

  intervalCallback () {
    // store.commit('setPosition', {x:Math.round(this.bomb.x), y:Math.round(this.bomb.y)});
  }

}