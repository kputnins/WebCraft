import {
  Scene,
  MeshBasicMaterial,
  Mesh,
  BoxGeometry,
  TextureLoader,
} from 'three';

import testImage from '../../assets/img/test.png';

export default class Level {
  private _scene: Scene;
  private _isLoaded = false;
  public testCube!: Mesh; // TODO remove

  public constructor() {
    this._scene = new Scene();
  }

  public get internalScene(): Scene {
    return this._scene;
  }

  public get isLoaded(): boolean {
    return this._isLoaded;
  }

  public load(): void {
    const texture = new TextureLoader().load(testImage);
    const material = new MeshBasicMaterial({ map: texture });
    const geometry = new BoxGeometry();
    this.testCube = new Mesh(geometry, material);
    this._scene.add(this.testCube);
    this._isLoaded = true;
    console.log('===== Level Loaded =====');
  }

  public unload(): void {
    this._isLoaded = false;
  }
}
