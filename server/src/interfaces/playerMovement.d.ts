import Movement from '../enums/movement';

interface PlayerMovement {
    x: number,
    y: number,
    currentMovement: Movement
}
export default PlayerMovement;