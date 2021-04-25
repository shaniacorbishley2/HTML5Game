import IGameObjectState from './interfaces/gameObjectState';

export default class GameObjectState implements IGameObjectState {
    public enermyConfig: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {   
        bounceX: 1,
        bounceY: 1,
        collideWorldBounds: true,
        immovable: true
    }

    public enermyObjects: Phaser.GameObjects.Image[] = [];

    public collectableConfig: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {   
        collideWorldBounds: true,
        immovable: true
    }

    public collectableObjects: Phaser.GameObjects.Image[] = [];
}