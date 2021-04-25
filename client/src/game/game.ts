import Phaser from 'phaser';
import BootScene from './scenes/bootScene';
import GameOverScene from './scenes/gameOverScene';
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
      autoCenter: Phaser.Scale.CENTER_BOTH,
      fullscreenTarget: 'game-container',
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: true,
        
      }
    },
    scene: [BootScene, PlayScene, MainMenuScene, GameOverScene]
  });
}

export default launch;
export { launch };
