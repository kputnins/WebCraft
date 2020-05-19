import { FRAMES_TO_COUNT } from '../constants/options';
import InputManager from './inputManager';

class Engine {
  private _screen: HTMLCanvasElement;
  private _aspect: number;
  private _version: string | undefined;
  private _gameTime = 0;
  private _frameCount = 0;

  /**
   * Creates an instance of Engine.
   *
   * @param {HTMLCanvasElement} canvas A canvas element where the screen of the game engine will be dawned
   * @param {number} width Width for determining the screen aspect ratio
   * @param {number} height Height for determining the screen aspect ratio
   * @memberof Engine
   */
  public constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this._screen = canvas;
    this._version = process.env.npm_package_version;

    if (width > height) this._aspect = width / height;
    else this._aspect = height / width;
  }

  /**
   * Initializes the engine and starts the game-loop
   *
   * @memberof Engine
   */
  public start(): void {
    console.log(`===== Engine ver ${this._version} started =====`);
    document.title = `WebCraft ${this._version}`;

    InputManager.init(this._screen);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onWindowResize();

    this.loop(0);
  }

  /**
   * Resizes the screen canvas element based on the engines aspect ratio
   *
   * @private
   * @memberof Engine
   */
  private onWindowResize(): void {
    let width: number;
    let height: number;
    const windowAspect = window.innerWidth / window.innerHeight;

    if (windowAspect >= this._aspect) {
      height = window.innerHeight;
      width = height * this._aspect;
    } else {
      width = window.innerWidth;
      height = width / this._aspect;
    }

    this._screen.width = width;
    this._screen.height = height;
  }

  /**
   * Game loop that computes fps and update the engine
   *
   * @private
   * @param {number} gameTime Value from witch to start the inner clock
   * @memberof Engine
   */
  private loop(gameTime: number): void {
    requestAnimationFrame(this.loop.bind(this));
    this._frameCount += 1;

    const lastTime = this._gameTime;
    this._gameTime = gameTime;

    const dt = (this._gameTime - lastTime) * 0.001;

    if (this._frameCount === FRAMES_TO_COUNT) this.updateFPS(dt);

    this.update(dt);
  }

  // eslint-disable-next-line class-methods-use-this
  private update(dt: number): void {
    // W
    if (InputManager.isKeyDown(87)) {
      console.log('w');
    }
    // S
    if (InputManager.isKeyDown(83)) {
      console.log('s');
    }
    // A
    if (InputManager.isKeyDown(65)) {
      console.log('a');
    }
    // D
    if (InputManager.isKeyDown(68)) {
      console.log('d');
    }
    // Q
    if (InputManager.isKeyDown(81)) {
      console.log('q');
    }
  }

  private updateFPS(dt: number): void {
    // eslint-disable-next-line no-bitwise
    const fps: number = (1 / dt) | 0;
    this._frameCount = 0;

    const fpsCounter = document.getElementById('fpsCounter');
    if (fpsCounter) fpsCounter.innerHTML = fps.toString();
  }
}

export default Engine;
