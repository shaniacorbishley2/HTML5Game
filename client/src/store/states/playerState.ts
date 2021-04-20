import Player from '@/game/objects/player/player';
import TeamPlayer from '@/game/objects/player/teamPlayer';
import IPlayerState from './interfaces/playerState.d';

export default class PlayerState implements IPlayerState {
    public players: Player[] = [];
    public mainPlayerId: string = '';
    public teamPlayers: TeamPlayer[] = [];
}