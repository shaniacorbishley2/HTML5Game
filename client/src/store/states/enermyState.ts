import Enermy from '@/game/objects/enermy';
import IEnermyState from './interfaces/enermyState.d';

export default class EnermyState implements IEnermyState {
    public config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig  = {   
                                                                        bounceX: 1,
                                                                        bounceY: 1,
                                                                        velocityX: 50,
                                                                        velocityY: 20,
                                                                        collideWorldBounds: true
                                                                    }
    public enermyObjects: Enermy[] = [];
}