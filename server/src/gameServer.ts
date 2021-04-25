import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import Movement from './enums/movement';
import PlayerHealth from './interfaces/playerHealth';
import PlayerInfo from './interfaces/playerInfo';
export default class GameServer {
  private app = express();

  private server: http.Server = http.createServer(this.app);

  private players: PlayerInfo[] = [];

  private gameStarted: boolean = false;

  private io: Server = new Server(this.server, {
    cors: {
      origin: "*"
    }
  });

  public start() {
    this.server.listen(process.env.PORT || 3000, () => {
      console.log(`App running on port ${process.env.PORT}`);
    });

    this.io.on('connection',  (socket: Socket) => {
      if (this.gameStarted) {
        this.io.emit('playDisabled');
      }

      socket.on('playerConnected', (name: string) => {
        this.playerConnected(socket.id, name);

        if (this.players.length > 1) {

          this.gameStartTimer(5, true);
        }
      });

      socket.on('disconnect', () => {
        this.playerDisconnect(socket.id);
      });

      socket.on('playerKeyPressed', (playerInfo: PlayerInfo[]) => {
        this.updatePlayerMovement(playerInfo[0]);

        this.io.emit('playerKeyPressed', this.players);

        // console.log(playerInfo[0].playerId, playerInfo[0].playerMovement.previousMovement, playerInfo[0].playerMovement.currentMovement, playerInfo[0].playerMovement.x, playerInfo[0].playerMovement.y);
        // console.log(this.players)
      });

      socket.on('playerLocation', (playerInfo: PlayerInfo[]) => {
        this.updatePlayerMovement(playerInfo[0]);
        this.io.emit('playerLocation', this.players);
      });

      socket.on('playerHit', (playerInfo: PlayerInfo[]) => {
        this.playerHit(playerInfo[0]);
      });

      socket.on('gameStarted', () => {
        this.gameStartTimer(5, false);
        this.io.emit('playDisabled');
      })
    });
  }

  private playerConnected(playerId: string, name: string) {
    this.players.push(
      {playerId: playerId, 
      playerMovement: {
        currentMovement: Movement.None,
        previousMovement: Movement.None,
        x: 0,
        y: 0
      },
      health: 100,
      name: name
    });


    this.io.emit('playerConnected', this.players);
    
    console.log(`player ${playerId} connected`);
  }

  private playerDisconnect(playerId: string) {
    console.log(`player ${playerId} disconnected`);

    this.players = this.players.filter((player: PlayerInfo) => player.playerId !== playerId);

    this.io.emit('playerDisconnected', this.players);
  }

  private updatePlayerMovement(playerInfo: PlayerInfo) {
    this.players.forEach((player: PlayerInfo) => {

      if (player.playerId === playerInfo.playerId) {    
        player.playerMovement = playerInfo.playerMovement;
      }

    });
  }

  private gameStartTimer(timerAmount: number, countdownToStart: boolean) {
    let timeLeft = timerAmount;
    
    const timer = setInterval(() => {
      if (timeLeft == -1) {
        clearTimeout(timer);

        if (countdownToStart) {
          this.io.emit('gameStarted');
          this.gameStarted = true;
        }

        else if (!countdownToStart) {
          this.io.emit('gameEnded');
          this.io.emit('playEnabled');

          this.players = [];
          this.io.emit('playerDisconnected', this.players);

          this.gameStarted = false;
        }
      }

      else if (this.players.length <= 0) {
        clearTimeout(timer);

        this.io.emit('gameEnded');
        this.io.emit('playEnabled');
        this.gameStarted = false;
      }

      else {
        countdownToStart ? this.io.emit('startGameTimer', [timeLeft]) : this.io.emit('endGameTimer', [timeLeft]);
        timeLeft--;
      }
    }, 1000);
  }

  private playerHit(playerInfo: PlayerInfo) {
    let playerHealth: PlayerHealth;

    this.players.find((player: PlayerInfo) => {
      if (player.playerId === playerInfo.playerId && player.health > 0) {
          player.health -= 20;

          playerHealth = {
            playerId: player.playerId,
            health: player.health
          };
          console.log('player hit', player.playerId, 'new health:', player.health);
          this.io.emit('updatePlayerHealth', [playerHealth]);
      }

      else if (player.health <= 0) {
        this.io.emit('playerDead', [player.playerId]);
        this.players = this.players.filter((playerInfo: PlayerInfo) => playerInfo.playerId !== player.playerId);
      }
    });
  }

  private playerHealthGained(playerInfo: PlayerInfo) {
    this.players.find((player: PlayerInfo, index) => {
      if (player.playerId === playerInfo.playerId) {
          this.players[index].health += 5;
      }
    });
  }
}
