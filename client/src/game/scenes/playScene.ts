import { Scene } from 'phaser';
import Player from '../objects/player/player';
import { io, Socket } from 'socket.io-client';
import EnermyGroup from '../objects/enermy/enermyGroup';
import Enermy from '../objects/enermy/enermy';
import { store } from '../../store';
import Movement from '../objects/enums/movement';
import GameObjectConfig from './../objects/interfaces/gameObjectConfig';
import PlayerMovement from '../objects/interfaces/playerMovement';
import MainPlayer from '../objects/player/mainPlayer';
import PlayerCollision from '../objects/interfaces/playerCollision';

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

  private buttonPressed: boolean = false;

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

    if (this.buttonPressed) {

    }
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
    const players: Player[] = store.getters['playerModule/players'];

    this.collisionLayers.forEach((layer) => {
      const playerCollisions: PlayerCollision = {scene: this, obj: layer};

      this.map.setCollisionBetween(0, 74, true, false, layer);

      store.dispatch('playerModule/submitPlayerCollisions', playerCollisions);

      this.physics.add.collider(this.enermyGroup, layer)
    });

    players.forEach((player: Player) => {
      this.physics.add.collider(player, this.enermyGroup, this.enermyPlayerCollide.bind(this));
    })
  }

  private playerConnected(serverPlayerIds: string[]) {
    const playerIds: string[] = store.getters['playerModule/playerIds'];
    if (serverPlayerIds.length !== playerIds.length) {

      serverPlayerIds.forEach((element) =>  {
        if (!playerIds.includes(element)) {

          this.addPlayer(element);
          this.createCollisions();
        }
      });
    }
    
  }

  // Logic to add another player to the scene
  private addPlayer(playerId: string): Player {

      const player = new Player(this, playerId); 
      // add to the players array
      store.dispatch('playerModule/submitAddPlayer',player);
    
      // Add player to the scene
      this.add.existing(player);

      return player;
  }

  private playerDisconnected(serverPlayerIds: string[]) {
    const playerIds: string[] = store.getters['playerModule/playerIds'];
    if (serverPlayerIds.length !== playerIds.length) {

      playerIds.forEach((id) =>  {
        if (!playerIds.includes(id)) {

         playerIds.filter(id => id !== id);
         store.dispatch('playerModule/removePlayer', id);
        }
      });
    }
  }



  private removeEnermy(enermy: Enermy) {
    enermy.destroy();
  }

  private listeners() {
    this.socket.on('playerConnected', (playerIds: string[]) => {
      this.playerConnected(playerIds);
    });

    this.socket.on('playerDisconnected', (playerIds: string[]) => {
      this.playerDisconnected(playerIds);
    });

    
    this.socket.on('playerKeyPressed', (playerMovement: PlayerMovement[]) => {
      this.buttonPressed = true;
      const players: Player[] = store.getters['playerModule/players'];

      const player: Player | undefined = players.find((player: Player, index) => {
        return player.playerId === playerMovement[0].playerId && index !== 0
      });
      
      this.additionalPlayerMovement(player, playerMovement[0].currentMovement);
    });

    this.socket.on('playerKeyReleased', (playerMovement: PlayerMovement[]) => {
    });
  }

  private additionalPlayerMovement(player: Player | undefined, movement: Movement) {
    if (player) {
        
        switch(movement) {
          
          case Movement.IdleLeft:
            player.idle(movement);
            break;

          case Movement.IdleRight:
            player.idle(movement);
            break;

          case Movement.JumpLeft:
            player.startJump(movement);
            break;

          case Movement.JumpRight: 
            player.startJump(movement);
            break;

          case Movement.Left: 
            player.movePlayerLeft();
            break;
        
          case Movement.Right: 
            player.movePlayerRight();
            break;

          case Movement.SideJumpLeft:
            player.sideJump(movement);
            break;

          case Movement.SideJumpRight: 
            player.sideJump(movement);
            break;
        }
    }
  }


  private enermyPlayerCollide(obj1: Phaser.Types.Physics.Arcade.ArcadeColliderType , obj2: Phaser.Types.Physics.Arcade.ArcadeColliderType) {
    const player = <Player>obj1;
    const enermy = <Enermy>obj2;

    player.playerHit();
    this.removeEnermy(enermy);
  }
}