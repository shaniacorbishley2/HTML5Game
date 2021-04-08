import { GameObjects, Scene } from 'phaser';
import Controls from '../objects/controls';
import MainPlayer from '../objects/mainPlayer';
import { io, Socket } from 'socket.io-client';
import Enermy from '../objects/enermy';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'playScene' });

    //SOCKET IO - this would change to a live
    this.socket = io('10.106.100.35:3000');

    this.socket.on('connect', () => {

    });
  }
  private controls!: Controls;

  private layers: string[] = ['Sky', 'Details', 'Platform-1', 'Platform-2', 'Platform-3', 
                                    'Platform-4', 'Platform-5', 'Platform-6', 'Blocks-1', 'Blocks-2','Blocks-3', 'Blocks-4', 'Blocks-5', 'Blocks-6', 'Blocks-7', 'Blocks-8', 'Bridge'];
  
  private map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  private socket!: Socket;

  private players: MainPlayer[] = [];

  private enermies: Enermy[] = [];

  private collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  private tilemapLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  public create () {

    this.initMap();

    this.createEnermies();  
    
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
  private setCollisions(type: string) {
    this.collisionLayers.forEach((layer: Phaser.Tilemaps.TilemapLayer) => {

      this.map.setCollisionBetween(0, 74, true, false, layer);

      if (type === 'player') {
        this.players.forEach((player) => {
          this.physics.add.collider(player, layer);
          player.setCollideWorldBounds(true);
        });
      }

      if (type === 'enermy') {
        this.enermies.forEach((enermy: Enermy) => {
          this.physics.add.collider(enermy, layer);

          this.players.forEach((player: MainPlayer) => {
            this.physics.add.collider(enermy, player, this.enermyPlayerCollide.bind(this));
            enermy.setCollideWorldBounds(true);
          });
        });
      }
    });        
  }

  // Filter the layers to only contain needed collision layers
  private filterCollisionLayers(layers: Phaser.Tilemaps.TilemapLayer[] ): Phaser.Tilemaps.TilemapLayer[] {
    return layers.filter((value: Phaser.Tilemaps.TilemapLayer) => {
      return (value.layer.name !== 'Sky' && value.layer.name !== 'Details');
    });
  }

  private initMap() {

    this.physics.world.setBounds( 0, 0, 640, 320);

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

  private createEnermies() {
    this.time.addEvent({
      delay: 4000,
      callback: this.addEnermies,
      callbackScope: this,
      loop: true
    });
  }

  // Logic to add another player to the scene
  private addPlayer(playerId: string) {
    
    const player = new MainPlayer(this, playerId); 
    // add to the players array
    this.players.push(player);
  
    // Add player to the scene
    this.add.existing(player);

    // Set collisions once player is created
    this.setCollisions('player');

    return player;
  }

  private addEnermies() {
      if (this.enermies.length < 5) {
        const enermy = new Enermy(this, `${this.enermies.length}`);
        
        this.enermies.push(enermy);

        this.add.existing(enermy);

  
        this.setCollisions('enermy');
      }
  }

  private removePlayer(playerId: string) {
    this.players = this.players.filter((player) => {
      if (player.playerId === playerId){
        player.destroy();
      }
      return player.playerId !== playerId;
    });
  }

  private removeEnermy(currentEnermy: Enermy) {
    this.enermies = this.enermies.filter((enermy) => {
      if (enermy.enermyId === currentEnermy.enermyId){
        enermy.destroy();
      }
      return enermy.enermyId !== currentEnermy.enermyId;
    });
  }

  private addPlayerControls(player: MainPlayer) {
    // Create controls
    this.controls = new Controls(player, this.socket);
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

  private enermyPlayerCollide(obj1: Phaser.Types.Physics.Arcade.ArcadeColliderType , obj2: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    const enermy = <Enermy>obj1;
    const player = <MainPlayer>obj2;

    this.removeEnermy(enermy);
    player.playerHit();
  }
  
  
}