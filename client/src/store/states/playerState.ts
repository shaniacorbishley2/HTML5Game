import Player from '@/game/objects/player/player';
import IPlayerState from './interfaces/playerState.d';

export default class PlayerState implements IPlayerState {
    public players: Player[] = [];
    public mainPlayerId: string = '';
}