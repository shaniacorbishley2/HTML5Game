import Movement from "../enums/movement";

interface PlayerMovement {
    playerId: string,
    x: number,
    y: number,
    currentMovement: Movement
}
export default PlayerMovement;