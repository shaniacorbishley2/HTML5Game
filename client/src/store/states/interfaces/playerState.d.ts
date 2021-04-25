import PlayerContainer from "@/game/objects/player/playerContainer";
interface IPlayerState {
    players: PlayerContainer[];
    mainPlayerId: string;
    scene: Phaser.Scene | null;
    mainPlayerName: string;
};

export default IPlayerState;