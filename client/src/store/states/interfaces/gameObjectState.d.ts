interface IGameObjectState {
    enermyConfig:  Phaser.Types.Physics.Arcade.PhysicsGroupConfig;
    enermyObjects: Phaser.GameObjects.Image[];
    collectableConfig: Phaser.Types.Physics.Arcade.PhysicsGroupConfig;
    collectableObjects: Phaser.GameObjects.Image[];
};

export default IGameObjectState;