import { Scene } from 'phaser';
import Controls from '../objects/controls';
import MainPlayer from '../objects/mainPlayer';
import { io, Socket } from 'socket.io-client';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'playScene' });
  }
  private controls!: Controls;

  private layers: string[] = ['Sky', 'Details', 'Platform-1', 'Platform-2', 'Platform-3', 
                                    'Platform-4', 'Platform-5', 'Platform-6'];
  
  private map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  private socket!: Socket;

  private players: MainPlayer[] = [];

  private collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  private tilemapLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  public create () {

    this.initMap();

    //SOCKET IO - this would change to a live
    this.socket = io('http://10.106.100.123:3000');

    this.socket.on('connect', () => {

    });

    this.createPlayer1();

    this.listeners();
  }
  
  public update () {
    this.controls.checkControls();
    this.players.forEach((player) => {
      player.setCollisionBox();
    });
  }

  // Init all layers
  private initTilemapLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return this.layers.map((value: string) => {
      return this.map.createLayer(value, this.tileset);
    });
  }

  // Add collisions on platform and allow collisions between player and platforms
  private setCollisions(layers: Phaser.Tilemaps.TilemapLayer[] ) {
    layers.forEach((value: Phaser.Tilemaps.TilemapLayer) => {

      this.map.setCollisionBetween(0, 74, true, false, value);

      this.players.forEach((player) => {
        this.physics.add.collider(player, value);
      });
      
    });        
  }

  // Filter the layers to only contain needed collision layers
  private filterCollisionLayers(layers: Phaser.Tilemaps.TilemapLayer[] ): Phaser.Tilemaps.TilemapLayer[] {
    return layers.filter((value: Phaser.Tilemaps.TilemapLayer) => {
      return (value.layer.name !== 'Sky' && value.layer.name !== 'Details');
    });
  }

  private initMap() {
    this.map = this.make.tilemap({ key: 'tilemap' });

    this.tileset = this.map.addTilesetImage('nature-tileset');

    // Init tilemap layers
    this.tilemapLayers = this.initTilemapLayers();
    
    // Filter out the layers that don't need collisions
    this.collisionLayers = this.filterCollisionLayers(this.tilemapLayers);
  }

  private createPlayer1() {
      // Create player
      const player1 = this.addPlayer('userPlayer');
      this.addPlayerControls(player1);

  }

  // Logic to add another player to the scene
  private addPlayer(playerId: string) {
    
    const player = new MainPlayer(this, playerId); 
    // add to the players array
    this.players.push(player);
  
    // Add player to the scene
    this.add.existing(player);

    // Set collisions once player is created
    this.setCollisions(this.collisionLayers);

    return player;
  }

  private removePlayer(playerId: string) {
    this.players = this.players.filter((player) => {
      if (player.playerId === playerId){
        player.destroy();
      }
      return player.playerId !== playerId;
    });
  }

  private addPlayerControls(player: MainPlayer) {
    // Create controls
    this.controls = new Controls(player);
    this.controls.createKeys();
  }

  private listeners() {
    this.socket.on('addPlayer', (playerId: string[]) => {
      this.addPlayer(playerId[0]);
    });

    this.socket.on ('removePlayer', (playerId: string[]) => {
      this.removePlayer(playerId[0]);
    });
  }
}