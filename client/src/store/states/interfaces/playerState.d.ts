import Player from "@/game/objects/player";
interface IPlayerState {
    players: Player[];
    mainPlayerId: string;
    teamPlayers: TeamPlayer[];
};

export default IPlayerState;