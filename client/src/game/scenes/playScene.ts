import { Scene } from 'phaser';
import Player from '../objects/player/player';
import { io, Socket } from 'socket.io-client';
import EnermyGroup from '../objects/enermy/enermyGroup';
import { store } from '../../store';
import GameObjectConfig from './../objects/interfaces/gameObjectConfig';
import MainPlayer from '../objects/player/mainPlayer';
import PlayerCollision from '../objects/interfaces/playerCollision';
import PlayerInfo from '../objects/interfaces/playerInfo';
import CollectableGroup from '../objects/collectable/collectableGroup';

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

  private collectableGroup!: CollectableGroup;

  private randomDataGenerator: Phaser.Math.RandomDataGenerator = new Phaser.Math.RandomDataGenerator('shania');

  private mainPlayer!: MainPlayer;

  public create () {

    //SOCKET IO - this would change to a live
    this.socket = io('10.106.101.12:3000');

    this.socket.on('connect', async () => {

      console.log('hello');

      console.log(this.socket.id);

      this.initMap();

      this.mainPlayer = new MainPlayer(this, this.socket);
  
      this.createEnermies();

      this.createCollectables();

      // Collisions between player/layer enermy etc
      this.createCollisions();
      
      // Socket io events
      await this.listeners();
    });

  }
  
  public update () {
    if (this.mainPlayer && this.mainPlayer.controls) {
      this.mainPlayer.controls.checkControls();
    }

    this.checkPlayersMovement();
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
    const gameObjectConfig: GameObjectConfig = { amount: 5, scene: this, texture: 'bomb', x: 0, y: 0 }

    const enermyConfig: Phaser.Types.GameObjects.Group.GroupCreateConfig = store.getters['gameObjectModule/enermyConfig'];

    store.dispatch('gameObjectModule/submitEnermyObjects', gameObjectConfig);

    const enermyObjects: Phaser.GameObjects.Image[] = store.getters['gameObjectModule/enermyObjects'];

    this.enermyGroup = new EnermyGroup(this.physics.world, this, enermyConfig, this.randomDataGenerator);

    this.enermyGroup.addEnermies(enermyObjects); 
  }

  private createCollisions() {
    this.collisionLayers.forEach((layer) => {
      const playerCollisions: PlayerCollision = {scene: this, colliderObject: layer};

      this.map.setCollisionBetween(0, 74, true, false, layer);

      store.dispatch('playerModule/submitPlayerCollisions', playerCollisions);

      this.physics.add.collider(this.enermyGroup, layer);
      this.physics.add.collider(this.collectableGroup, layer);
    });

    const playerCollisions: PlayerCollision = { scene: this, colliderObject: this.enermyGroup, callback: this.enermyPlayerCollide.bind(this) };
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
  private addPlayer(playerInfo: PlayerInfo): Player {

      const player = new Player(this, playerInfo); 
      // add to the players array
      store.dispatch('playerModule/submitAddPlayer', player);
    
      // Add player to the scene
      this.add.existing(player);

      return player;
  }

  private removeEnermy(enermy: Phaser.GameObjects.Image) {
    enermy.destroy();
  }

  private async listeners() {
    this.socket.on('playerConnected', (playersInfo: PlayerInfo[]) => {
      this.playerConnected(playersInfo);
      
    });

    this.socket.on('playerDisconnected', async (playersInfo: PlayerInfo[]) => {
      await store.dispatch('playerModule/submitPlayerDisconnected', playersInfo);
    });

    this.socket.on('playerKeyPressed', async (playersInfo: PlayerInfo[]) => {
      store.dispatch('playerModule/submitPlayersMovement', playersInfo);
    });

    this.socket.on('playerLocation', (playersInfo: PlayerInfo[]) => {
      store.dispatch('playerModule/submitTeamPlayersLocation', playersInfo);
    });
  }

  private checkPlayersMovement() {
    const players: MainPlayer[] = store.getters['playerModule/players'];

    if (players && players.length > 0) {
      players.forEach((player) => {
          if (player !== undefined) {

            player.checkPlayerMovement();
          }
          // Loop through movement 
  
      });
    }
  }

  private enermyPlayerCollide(obj1: Phaser.Types.Physics.Arcade.ArcadeColliderType , obj2: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    const player = <Player>obj1;
    const enermy = <Phaser.GameObjects.Image>obj2;

    player.playerHit();
    this.removeEnermy(enermy);
  }

  private createCollectables() {
    const gameObjectConfig: GameObjectConfig = { amount: 3, scene: this, texture: 'yellow-gem', x: 340, y: 49 }

    store.dispatch('gameObjectModule/submitCollectableObjects', gameObjectConfig);

    const collectableConfig: Phaser.Types.GameObjects.Group.GroupCreateConfig = store.getters['gameObjectModule/collectableConfig'];

    store.dispatch('gameObjectModule/submitCollectableObjects', gameObjectConfig);

    const collectableObjects: Phaser.GameObjects.Image[] = store.getters['gameObjectModule/collectableObjects'];

    this.collectableGroup = new CollectableGroup(this.physics.world, this, collectableConfig, this.randomDataGenerator);

    this.collectableGroup.addCollectables(collectableObjects); 
  }
}