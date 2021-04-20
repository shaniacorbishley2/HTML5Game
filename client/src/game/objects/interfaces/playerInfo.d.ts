import PlayerMovement from "./playerMovement";


interface PlayerInfo {
    playerId: string,
    playerMovement: PlayerMovement | null
}
export default PlayerInfo;