import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PlayScene from './scenes/PlayScene';


function launch(containerId: any) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 640,
    height: 320,
    parent: containerId,
    render: {
      pixelArt: true
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: [BootScene, PlayScene]
  });
}

export default launch;
export { launch };
