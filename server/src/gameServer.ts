import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import PlayerMovement from './interfaces/playerMovement';

export default class GameServer {
  private app = express();

  private server: http.Server = http.createServer(this.app);

  private socketIds: string[] = [];

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
      this.playerConnected(socket.id);

      socket.on('disconnect', () => {
        this.playerDisconnect(socket.id);
      });

      socket.on('playerKeyPressed', (args: any[]) => {
        const playerMovement = <PlayerMovement> args[0];

        this.io.emit('playerKeyPressed', [playerMovement]);
        console.log(playerMovement.playerId,  playerMovement.x, playerMovement.y);
      });
    });

  }

  private playerConnected(socketId: string) {

    // TODO: if there are 5 players already then the 6th player has to be a spectator
    // If the game is in process and a player leaves, 6th player cannot join until the game has ended

    // Else let the player join
    // If there is only one player then continue as normal
    
    this.socketIds.push(socketId);
    
      // If there is already one player in the game, we need to call the logic to 'add another player' emit the event on created
     
    this.io.emit('playerConnected', this.socketIds);
    
    console.log(`player ${socketId} connected`);
    console.log(`there are ${this.socketIds.length} socketIds`);
  }

  private playerDisconnect(socketId: string) {
    console.log(`player ${socketId} disconnected`);

    this.socketIds = this.socketIds.filter(player => player !== socketId);

    this.io.emit('playerDisconnected', this.socketIds);
  }

}
