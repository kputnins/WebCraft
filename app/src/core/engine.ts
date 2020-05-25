import { FRAMES_TO_COUNT } from '../constants/options';
import Renderer from './renderer';
import InputManager from './inputManager';
import Game from '../game';

class Engine {
  private _renderer: Renderer;
  private _screen: HTMLCanvasElement;
  private _aspect: number;
  private _version: string | undefined;
  private _gameTime = 0;
  private _frameCount = 0;
  private _game: Game;

  public constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this._screen = canvas;
    this._renderer = new Renderer(canvas);
    this._version = process.env.npm_package_version;
    this._game = new Game();

    if (width > height) this._aspect = width / height;
    else this._aspect = height / width;
  }

  public start(): void {
    console.log(`===== Engine ver ${this._version} Started =====`);
    document.title = `WebCraft ${this._version}`;

    InputManager.init(this._screen);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onWindowResize();

    this._game.onStartup(this._aspect);

    this.loop(0);
  }

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

    this._renderer.onResize(width, height);
  }

  private loop(gameTime: number): void {
    requestAnimationFrame(this.loop.bind(this));
    this._frameCount += 1;

    const lastTime = this._gameTime;
    this._gameTime = gameTime;

    const dt = (this._gameTime - lastTime) * 0.001;

    if (this._frameCount === FRAMES_TO_COUNT) this.updateFPS(dt);

    this.update(dt);
  }

  private update(dt: number): void {
    this._game.update(dt);
    this._renderer.update();
    if (this._game.activeLevel && this._game.activeLevel.isLoaded) {
      this._renderer.render(this._game.activeLevel, this._game.activeCamera);
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
