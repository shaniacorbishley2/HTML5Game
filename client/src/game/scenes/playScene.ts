import { Scene } from 'phaser';
import Player from '../objects/player/player';
import { io, Socket } from 'socket.io-client';
import EnermyGroup from '../objects/enermy/enermyGroup';
import Enermy from '../objects/enermy/enermy';
import { store } from '../../store';
import GameObjectConfig from './../objects/interfaces/gameObjectConfig';
import MainPlayer from '../objects/player/mainPlayer';
import PlayerCollision from '../objects/interfaces/playerCollision';
import TeamPlayer from '../objects/player/teamPlayer';
import PlayerInfo from '../objects/interfaces/playerInfo';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'playScene' });
  }

  private layers: string[] = ['Sky', 'Details', 'Platform-1', 'Platform-2', 'Platform-3', 
                                    'Platform-4', 'Platform-5', 'Platform-6', 'Blocks-1', 'Blocks-2','Blocks-3', 'Blocks-4', 'Blocks-5', 'Blocks-6', 'Blocks-7', 'Blocks-8', 'Bridge'];
  
  private map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  private socket!: Socket;

  private collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  private tilemapLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  private enermyGroup!: EnermyGroup;

  private randomDataGenerator: Phaser.Math.RandomDataGenerator = new Phaser.Math.RandomDataGenerator('shania');

  private mainPlayer!: MainPlayer;

  public create () {

    //SOCKET IO - this would change to a live
    this.socket = io('10.106.101.12:3000');

    this.socket.on('connect', () => {

      console.log(this.socket.id);

      this.initMap();

      this.mainPlayer = new MainPlayer(this, this.socket);
  
      this.createEnermies();

      this.createCollisions();
    
      this.listeners();
    });

  }
  
  public update () {
    if (this.mainPlayer && this.mainPlayer.controls) {
      this.mainPlayer.controls.checkControls();
    }

    this.checkTeamPlayersMovement();
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

  private createEnermies() {
    const gameObjectConfig: GameObjectConfig = { amount: 5, scene: this, texture: 'bomb' }

    const enermyConfig: Phaser.Types.GameObjects.Group.GroupCreateConfig = store.getters['enermyModule/config'];

    store.dispatch('enermyModule/submitEnermyObjects', gameObjectConfig);

    const enermyObjects: Enermy[] = store.getters['enermyModule/enermyObjects'];

    this.enermyGroup = new EnermyGroup(this.physics.world, this, enermyConfig, this.randomDataGenerator);

    this.enermyGroup.addEnermies(enermyObjects); 
  }

  private createCollisions() {
    this.collisionLayers.forEach((layer) => {
      const playerCollisions: PlayerCollision = {scene: this, colliderObject: layer};

      this.map.setCollisionBetween(0, 74, true, false, layer);

      store.dispatch('playerModule/submitPlayerCollisions', playerCollisions);

      this.physics.add.collider(this.enermyGroup, layer)
    });

    const playerCollisions: PlayerCollision = {scene: this, colliderObject: this.enermyGroup, callback: this.enermyPlayerCollide.bind(this) };
    store.dispatch('playerModule/submitPlayerCollisions', playerCollisions);
  }

  private playerConnected(playersInfo: PlayerInfo[]) {
    const playerIds: string[] = store.getters['playerModule/playerIds'];
    if (playersInfo.length !== playerIds.length) {

      playersInfo.forEach((element) =>  {
        if (!playerIds.includes(element.playerId)) {

          this.addPlayer(element);
          this.createCollisions();
        }
      });
    }
    
  }

  // Logic to add another player to the scene
  private addPlayer(playerInfo: PlayerInfo): TeamPlayer {

      const player = new TeamPlayer(this, playerInfo); 
      // add to the players array
      store.dispatch('playerModule/submitAddPlayer', player);

      store.dispatch('playerModule/submitAddTeamPlayer', player);
    
      // Add player to the scene
      this.add.existing(player);

      return player;
  }

  private playerDisconnected(playersInfo: PlayerInfo[]) {
    const playerIds: string[] = store.getters['playerModule/playerIds'];
    if (playersInfo.length !== playerIds.length) {

      playersInfo.forEach((playerInfo) =>  {
        if (!playerIds.includes(playerInfo.playerId)) {

          playerIds.filter(id => id !== playerInfo.playerId);
          store.dispatch('playerModule/removePlayer', playerInfo.playerId);
        }
      });
    }
  }

  private removeEnermy(enermy: Enermy) {
    enermy.destroy();
  }

  private listeners() {
    this.socket.on('playerConnected', (playersInfo: PlayerInfo[]) => {
      this.playerConnected(playersInfo);
      
    });

    this.socket.on('playerDisconnected', (playersInfo: PlayerInfo[]) => {
      this.playerDisconnected(playersInfo);
    });

    this.socket.on('playerKeyPressed', async (playersInfo: PlayerInfo[]) => {
      await store.dispatch('playerModule/submitTeamPlayersMovement', playersInfo);
    });

    this.socket.on('playerLocation', (playersInfo: PlayerInfo[]) => {
      store.dispatch('playerModule/submitTeamPlayersLocation', playersInfo);
    });
  }

  private checkTeamPlayersMovement() {
    const teamPlayers: TeamPlayer[] = store.getters['playerModule/teamPlayers'];
    if (teamPlayers) {

      teamPlayers.forEach((player: TeamPlayer) => {
          // Loop through movement 
          player.checkPlayerMovement();
  
      });
    }
  }

  private enermyPlayerCollide(obj1: Phaser.Types.Physics.Arcade.ArcadeColliderType , obj2: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    const player = <Player>obj1;
    const enermy = <Enermy>obj2;

    player.playerHit();
    this.removeEnermy(enermy);
  }
}