import PlayerMovement from "./playerMovement";
interface PlayerInfo {
    playerId: string,
    playerMovement: PlayerMovement
    health: number;
}
export default PlayerInfo;