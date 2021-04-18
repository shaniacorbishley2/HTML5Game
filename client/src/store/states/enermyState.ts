import Enermy from "../../game/objects/enermy/enermy";
import IEnermyState from './interfaces/enermyState.d';

export default class EnermyState implements IEnermyState {
    public config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig  = {   
                                                                        bounceX: 1,
                                                                        bounceY: 1,
                                                                        collideWorldBounds: true,
                                                                        immovable: true
                                                                    }
    public enermyObjects: Enermy[] = [];
}