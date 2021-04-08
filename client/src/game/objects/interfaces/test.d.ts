import Enermy from "../enermy";
import MainPlayer from "../mainPlayer";

interface Test {
    test: MainPlayer | Enermy | Phaser.Types.Physics.Arcade.ArcadeColliderType | Phaser.GameObjects.GameObject | Phaser.GameObjects.Group | Phaser.Physics.Arcade.Sprite | Phaser.Physics.Arcade.Image | Phaser.Physics.Arcade.StaticGroup | Phaser.Physics.Arcade.Group | Phaser.Tilemaps.TilemapLayer | Phaser.GameObjects.GameObject[] | Phaser.Physics.Arcade.Sprite[] | Phaser.Physics.Arcade.Image[] | Phaser.Physics.Arcade.StaticGroup[] | Phaser.Physics.Arcade.Group[] | Phaser.Tilemaps.TilemapLayer[];
}
export default Test;