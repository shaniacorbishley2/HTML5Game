import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';
import EnermyGroup from '../objects/enermy/enermyGroup';
import { store } from '../../store';
import GameObjectConfig from './../objects/interfaces/gameObjectConfig';
import PlayerCollision from '../objects/interfaces/playerCollision';
import PlayerInfo from '../objects/interfaces/playerInfo';
import CollectableGroup from '../objects/collectable/collectableGroup';
import PlayerContainer from '../objects/player/playerContainer';
import Player from '../objects/player/player';
import MainPlayerContainer from '../objects/player/mainPlayerContainer';
import Movement from '../objects/enums/movement';
import PlayerText from '../objects/player/playerText';

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

  private mainPlayerContainer!: MainPlayerContainer;

  public init(data: any) {
    this.socket = data.socket;
  }

  public create () {
    store.dispatch('playerModule/submitAddScene', this);

    this.socket.emit('playerConnected');
    
    this.scale.lockOrientation('landscape');

    console.log(this.socket.id);

    this.initMap();

    const player = new Player(this, this.socket.id);

    const playerName: string = store.getters['playerModule/playerName'];
    console.log(playerName);

    const text = new PlayerText(this, playerName);

    this.mainPlayerContainer = new MainPlayerContainer(this, this.socket, player, text, {
      playerId: this.socket.id,
      playerMovement: {
        currentMovement: Movement.None,
        previousMovement: Movement.None,
        x: 0,
        y: 0
      }
    });

    this.createEnermies();

    this.createCollectables();

    // Collisions between player/layer enermy etc
    this.createCollisions();
    
    // Socket io events
    this.listeners();

  }
  
  public update () {
    if (this.mainPlayerContainer && this.mainPlayerContainer.controls) {
      this.mainPlayerContainer.controls.checkControls();
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
      const playerLayerCollisions: PlayerCollision = {scene: this, colliderObject: layer};

      this.map.setCollisionBetween(0, 74, true, false, layer);

      store.dispatch('playerModule/submitPlayerCollisions', playerLayerCollisions);

      this.physics.add.collider(this.enermyGroup, layer);
      this.physics.add.collider(this.collectableGroup, layer);
    });

    const playerEnermyCollisions: PlayerCollision = { scene: this, colliderObject: this.enermyGroup, callback: this.enermyPlayerCollide.bind(this) };
    store.dispatch('playerModule/submitPlayerCollisions', playerEnermyCollisions);

    const playerCollectableOverlap: PlayerCollision = { scene: this, colliderObject: this.collectableGroup, callback: this.collectablePlayerOverlap.bind(this) };
    store.dispatch('playerModule/submitPlayerOverlap', playerCollectableOverlap);
  }

  private playerConnected(playersInfo: PlayerInfo[]) {
    const players: PlayerContainer[] = store.getters['playerModule/players'];
    console.log(players);
    if (playersInfo.length !== players.length){
      playersInfo.forEach((playerInfo: PlayerInfo) => {
        const matchingPlayer = players.some((playerContainer: PlayerContainer) => playerContainer.playerInfo.playerId === playerInfo.playerId);

        if (!matchingPlayer) {
          const player = new Player(this, playerInfo.playerId);

          const text = new PlayerText(this, 'player');

          const playerContainer = new PlayerContainer(this, player, text, playerInfo);

          store.dispatch('playerModule/submitAddPlayer', playerContainer);

          playerContainer.addToScene();
        }

      });
    }
  }

  private listeners() {
    this.socket.on('playerConnected', (playersInfo: PlayerInfo[]) => {
      this.playerConnected(playersInfo);
      this.createCollisions();
    });

    this.socket.on('playerDisconnected', (playersInfo: PlayerInfo[]) => {

      store.dispatch('playerModule/submitPlayerDisconnected', playersInfo);
    });

    this.socket.on('playerKeyPressed', (playersInfo: PlayerInfo[]) => {
      store.dispatch('playerModule/submitPlayersMovement', playersInfo);
    });

    this.socket.on('playerLocation', (playersInfo: PlayerInfo[]) => {
      store.dispatch('playerModule/submitTeamPlayersLocation', playersInfo);
    });
  }

  private checkPlayersMovement() {
    const players: PlayerContainer[] = store.getters['playerModule/players'];

    if (players && players.length > 0) {
      players.forEach((playerContainer) => {
          if (playerContainer !== undefined) {

            playerContainer.checkPlayerMovement();
          }  
      });
    }
  }

  private enermyPlayerCollide(obj1: Phaser.Types.Physics.Arcade.ArcadeColliderType , obj2: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    const playerContainer = <PlayerContainer>obj1;
    const enermy = <Phaser.GameObjects.Image>obj2;

    playerContainer.player.removeHealth();
    enermy.destroy();
  }

  private collectablePlayerOverlap(obj1: Phaser.Types.Physics.Arcade.ArcadeColliderType , obj2: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    const playerContainer = <PlayerContainer>obj1;
    const collectable = <Phaser.GameObjects.Image>obj2;

    if (playerContainer.player.playerHealth < 100) {
      playerContainer.player.addHealth();
      collectable.destroy();
    }
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