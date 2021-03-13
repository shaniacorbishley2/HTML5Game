import Phaser from 'phaser';
import BootScene from './scenes/bootScene';
import MainMenuScene from './scenes/mainMenuScene';
import PlayScene from './scenes/playScene';


function launch(containerId: any) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 640,
    height: 320,
    parent: containerId,
    render: {
      pixelArt: true
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false,
        
      }
    },
    scene: [BootScene, PlayScene, MainMenuScene]
  });
}

export default launch;
export { launch };
