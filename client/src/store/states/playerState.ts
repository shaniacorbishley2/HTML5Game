import PlayerContainer from '@/game/objects/player/playerContainer';
import IPlayerState from './interfaces/playerState.d';

export default class PlayerState implements IPlayerState {
    public players: PlayerContainer[] = [];
    public mainPlayerId: string = '';
    public scene: Phaser.Scene | null = null;
    public mainPlayerName: string = '';
}