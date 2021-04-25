import PlayerMovement from "./playerMovement";
interface PlayerInfo {
    playerId: string,
    playerMovement: PlayerMovement
    health: number;
    name: string;
}
export default PlayerInfo;