import { Scene } from 'phaser';
import Controls from '../objects/controls';
import MainPlayer from '../objects/mainPlayer';
import { io, Socket } from 'socket.io-client';
import EnermyGroup from '../objects/enermyGroup';
import Enermy from '../objects/enermy';
import { store } from '../../store';
import GameObjectConfig from './../objects/interfaces/gameObjectConfig';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'playScene' });
  }
  private controls!: Controls;

  private layers: string[] = ['Sky', 'Details', 'Platform-1', 'Platform-2', 'Platform-3', 
                                    'Platform-4', 'Platform-5', 'Platform-6', 'Blocks-1', 'Blocks-2','Blocks-3', 'Blocks-4', 'Blocks-5', 'Blocks-6', 'Blocks-7', 'Blocks-8', 'Bridge'];
  
  private map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  private socket!: Socket;

  private players: MainPlayer[] = [];

  private collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  private tilemapLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  private enermyGroup!: EnermyGroup;

  public create () {

    //SOCKET IO - this would change to a live
    this.socket = io('10.106.101.12:3000');

    this.socket.on('connect', () => {

      console.log(this.socket.id);

      this.initMap();
  
      this.createEnermies();
      
      this.createPlayer1(this.socket.id);

      this.createCollisions();
    
      this.listeners();
    });

  }
  
  public update () {
    if (this.controls) {
      this.controls.checkControls();
    }

    // if (this.enermies && this.enermies.children.size < 5) {
    // }
  }

  // Init all layers
  private initTilemapLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return this.layers.map((value: string) => {
      return this.map.createLayer(value, this.tileset);
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

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.map = this.make.tilemap({ key: 'tilemap' });

    this.tileset = this.map.addTilesetImage('nature-tileset');

    // Init tilemap layers
    this.tilemapLayers = this.initTilemapLayers();
    
    // Filter out the layers that don't need collisions
    this.collisionLayers = this.filterCollisionLayers(this.tilemapLayers);

    
  }

  private createPlayer1(playerId: string) {
      // Create player
      const player1 = this.addPlayer(playerId);
      this.addPlayerControls(player1);
  }

  private createEnermies() {
    const gameObjectConfig: GameObjectConfig = { amount: 5, scene: this, texture: 'bomb' }

    const enermyConfig: Phaser.Types.GameObjects.Group.GroupCreateConfig = store.getters['enermyModule/config'];

    store.dispatch('enermyModule/submitEnermyObjects', gameObjectConfig);

    const enermyObjects: Enermy[] = store.getters['enermyModule/enermyObjects'];

    this.enermyGroup= new EnermyGroup(this.physics.world, this, enermyConfig);

    this.enermyGroup.addEnermies(enermyObjects); 
  }

  private createCollisions() {
    this.collisionLayers.forEach((layer) => {
      this.map.setCollisionBetween(0, 74, true, false, layer);

      this.players.forEach((player: MainPlayer) => {
        this.physics.add.collider(player, layer);
      });

      this.physics.add.collider(this.enermyGroup, layer)
    });

    this.players.forEach((player: MainPlayer) => {
      this.physics.add.collider(player, this.enermyGroup, this.enermyPlayerCollide.bind(this));
    })
  }

  // Logic to add another player to the scene
  private addPlayer(playerId: string) {
    
    const player = new MainPlayer(this, playerId); 
    // add to the players array
    this.players.push(player);
  
    // Add player to the scene
    this.add.existing(player);

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

  private removeEnermy(enermy: Enermy) {
    enermy.destroy();
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
    const player = <MainPlayer>obj1;
    const enermy = <Enermy>obj2;

    player.playerHit();
    this.removeEnermy(enermy);
  }
}