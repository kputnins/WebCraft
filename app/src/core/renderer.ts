import { WebGLRenderer, WebGLRendererParameters, Camera, WebGLInfo } from 'three';
import { RENDERER_CLEAR_COLOR } from '../constants/options';
import Level from '../level/level';

export default class Renderer {
  private _internal: WebGLRenderer;

  public constructor(canvasElement: HTMLCanvasElement) {
    const params: WebGLRendererParameters = {
      canvas: canvasElement,
      antialias: true,
    };
    this._internal = new WebGLRenderer(params);
    this._internal.setClearColor(RENDERER_CLEAR_COLOR);
  }

  public update(): void {
    this._internal.clear();
  }

  public render(level: Level, camera: Camera): void {
    this._internal.render(level.internalScene, camera);
  }

  public onResize(width: number, height: number): void {
    this._internal.setSize(width, height);
  }

  public getInfo(): WebGLInfo {
    return this._internal.info;
  }
}
