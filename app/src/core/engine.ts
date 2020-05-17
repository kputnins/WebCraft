class Engine {
  private _screen: HTMLCanvasElement;
  private _aspect: number;
  private _version: string | undefined;
  private _gameTime = 0;

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

    document.title = `WebCraft ${this._version}`;

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

    window.addEventListener('resize', this.onWindowResize.bind(this));

    this.onWindowResize();

    // this.loop(0);
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
}

export default Engine;
