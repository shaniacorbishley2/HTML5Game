import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import Movement from './enums/movement';
import PlayerInfo from './interfaces/playerInfo';
export default class GameServer {
  private app = express();

  private server: http.Server = http.createServer(this.app);

  private players: PlayerInfo[] = [];

  private io: Server = new Server(this.server, {
    cors: {
      origin: "*"
    }
  });

  public start() {
    this.server.listen(3000, '10.106.101.12', () => {
      console.log(`App running on port ${3000}`);
    });

    this.io.on('connection',  (socket: Socket) => {
      socket.on('playerConnected', () => {
        this.playerConnected(socket.id);
      });

      socket.on('disconnect', () => {
        this.playerDisconnect(socket.id);
      });

      socket.on('playerKeyPressed', (playerInfo: PlayerInfo[]) => {
        this.updatePlayerMovement(playerInfo[0]);

        this.io.emit('playerKeyPressed', this.players);

        console.log(playerInfo[0].playerId, playerInfo[0].playerMovement.previousMovement, playerInfo[0].playerMovement.currentMovement, playerInfo[0].playerMovement.x, playerInfo[0].playerMovement.y);
        console.log(this.players)
      });

      socket.on('playerLocation', (playerInfo: PlayerInfo[]) => {
        this.updatePlayerMovement(playerInfo[0]);
        this.io.emit('playerLocation', this.players);
      });

    });
  }

  private playerConnected(playerId: string) {

    // TODO: if there are 5 players already then the 6th player has to be a spectator
    // If the game is in process and a player leaves, 6th player cannot join until the game has ended

    // Else let the player join
    // If there is only one player then continue as normal
    this.players.push({playerId: playerId, playerMovement: {
      currentMovement: Movement.None,
      previousMovement: Movement.None,
      x: 0,
      y: 0
    }});
    
      // If there is already one player in the game, we need to call the logic to 'add another player' emit the event on created

    console.log(this.players);

    this.io.emit('playerConnected', this.players);
    
    console.log(`player ${playerId} connected`);
    console.log(`there are ${this.players.length} players`);
  }

  private playerDisconnect(playerId: string) {
    //console.log(`player ${playerId} disconnected`);

    this.players = this.players.filter((player: PlayerInfo) => player.playerId !== playerId);

    this.io.emit('playerDisconnected', this.players);
  }

  private updatePlayerMovement(playerInfo: PlayerInfo) {
    //(this.players);
    this.players.forEach((player: PlayerInfo) => {

      if (player.playerId === playerInfo.playerId) {    
        player.playerMovement = playerInfo.playerMovement;
      }

    });
  }

}
