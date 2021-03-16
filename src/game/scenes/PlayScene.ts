import { Scene } from 'phaser';
import Controls from '../objects/controls';
import MainPlayer from '../objects/mainPlayer';

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'playScene' });
  }
  public player1!: MainPlayer;

  public controls!: Controls;

  private layers: string[] = ['Sky', 'Details', 'Platform-1', 'Platform-2', 'Platform-3', 
                                    'Platform-4', 'Platform-5', 'Platform-6'];
  
  private map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  create () {
    this.map = this.make.tilemap({ key: 'tilemap' });

    this.tileset = this.map.addTilesetImage('nature-tileset');

    // Init tilemap layers
    const tilemapLayers = this.initTilemapLayers();
    
    // Filter out the layers that don't need collisions
    const collisionLayers = this.filterCollisionLayers(tilemapLayers);

    // Create player
    this.player1 = new MainPlayer(this); 
    
    // Add player
    this.add.existing(this.player1);

    // Set collisions once player is created
    this.setCollisions(collisionLayers);

    // Create controls
    this.controls = new Controls(this.player1);

  }
  
  update () {
    // update
    this.controls.checkControls();

  }

  intervalCallback () {
    // store.commit('setPosition', {x:Math.round(this.bomb.x), y:Math.round(this.bomb.y)});
  }

  // Init all layers
  public initTilemapLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return this.layers.map((value: string) => {
      return this.map.createLayer(value, this.tileset);
    });
  }

  // Add collisions on platform and allow collisions between player and platforms
  public setCollisions(layers: Phaser.Tilemaps.TilemapLayer[] ) {
    layers.forEach((value: Phaser.Tilemaps.TilemapLayer) => {

      this.map.setCollisionBetween(0, 74, true, false, value);
      this.physics.add.collider(this.player1, value);

    });     
        
  }

  // Filter the layers to only contain needed collision layers
  public filterCollisionLayers(layers: Phaser.Tilemaps.TilemapLayer[] ): Phaser.Tilemaps.TilemapLayer[] {
    return layers.filter((value: Phaser.Tilemaps.TilemapLayer) => {
      return (value.layer.name !== 'Sky' && value.layer.name !== 'Details');
    });
  }

}