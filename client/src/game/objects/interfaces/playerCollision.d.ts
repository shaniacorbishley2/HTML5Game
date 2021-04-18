interface PlayerCollision {
    scene: Phaser.Scene,
    colliderObject: Phaser.Tilemaps.TilemapLayer | EnermyGroup,
    callback?: ArcadePhysicsCallback
}
export default PlayerCollision;