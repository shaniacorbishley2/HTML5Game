import Enermy from "../../../game/objects/enermy/enermy";

interface IEnermyState {
    config:  Phaser.Types.Physics.Arcade.PhysicsGroupConfig;
    enermyObjects: Enermy[]
};

export default IEnermyState;