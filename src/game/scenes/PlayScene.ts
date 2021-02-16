import { Scene } from 'phaser';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
  }

  bomb!: Phaser.Physics.Arcade.Image;

  create () {
    debugger;
    this.add.image(400, 300, 'sky');

    this.bomb = this.physics.add.image(400, 200, 'bomb')
    this.bomb.setCollideWorldBounds(true);
    (this.bomb.body as Phaser.Physics.Arcade.Body).onWorldBounds = true // enable worldbounds collision event
    this.bomb.setBounce(1);
    this.bomb.setVelocity(200, 20);

    this.time.addEvent({
      delay: 100, // ms
      callback: this.intervalCallback,
      callbackScope: this,
      loop: true
    });

    // store.dispatch('onStop', () => {
    //   this.bomb.setVelocityX(0);
    // });
  }
  
  update () {
    // update
  }

  intervalCallback () {
    // store.commit('setPosition', {x:Math.round(this.bomb.x), y:Math.round(this.bomb.y)});
  }

}