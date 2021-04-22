import Player from '@/game/objects/player/player';
import IPlayerState from './interfaces/playerState.d';

export default class PlayerState implements IPlayerState {
    public players: any[] = [];
    public mainPlayerId: string = '';
}