import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

export default class GameServer {
  private app = express();

  private server: http.Server = http.createServer(this.app);

  private players: string[] = [];

  private io = new Server(this.server, {
    cors: {
      origin: "*"
    }
  });

  public start() {
    this.server.listen(3000, () => {
      console.log(`App running on port ${3000}`);
    });

    this.io.on('connection',  (socket) => {
      this.userConnected(socket.id);

      socket.on('disconnect', () => {
        this.userDisconnect(socket.id);
      });
    });
  }

  private userConnected(socketId: string) {

    // TODO: if there are 5 players already then the 6th player has to be a spectator
    // If the game is in process and a player leaves, 6th player cannot join until the game has ended

    // Else let the player join
    
    if (this.players.length >= 1) {
      // If there is already one player in the game, we need to call the logic to 'add another player' emit the event on created
      this.players.forEach(() => {
        this.io.emit('addPlayer', [socketId]);
      })
    }

    // If there is only one player then continue as normal
    this.players.push(socketId);
    console.log(`User ${socketId} connected`);
  }


  private userDisconnect(socketId: string) {
    console.log(`User ${socketId} disconnected`);
    this.io.emit('removePlayer', [socketId]);
    this.players = this.players.filter(player => player !== socketId);
  }
}
