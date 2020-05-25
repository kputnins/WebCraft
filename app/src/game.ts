import { PerspectiveCamera, Camera, Vector2 } from 'three';
import IMessageHandler from './message/iMessageHandler';
import Message from './message/message';
import InputEventMessage from './constants/inputEventMessage';
import InputManager from './core/inputManager';
import TMath from './utils/tMaths';
import Level from './level/level';

export default class Game implements IMessageHandler {
  private _camera!: PerspectiveCamera;
  private _level!: Level;
  private _angle = 0;
  private _movementSpeed = 5;

  public get activeCamera(): Camera {
    return this._camera;
  }

  public get activeLevel(): Level {
    return this._level;
  }

  public onStartup(aspect: number): void {
    this._camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
    this._camera.position.set(0, 0, 2);

    Message.subscribe(InputEventMessage.KEY_DOWN, this);
    Message.subscribe(InputEventMessage.KEY_UP, this);

    this.startNew();
  }

  public startNew(): void {
    console.log('===== New Game Started =====');
    this._level = new Level();
    this._level.load();
  }

  // eslint-disable-next-line class-methods-use-this
  public loadExisting(): void {
    throw new Error('Not implemented yet!');
  }

  public update(dt: number): void {
    let movingForward = false;
    let movingBackward = false;
    let movingLeft = false;
    let movingRight = false;
    let turningLeft = false;
    let turningRight = false;

    // W
    if (InputManager.isKeyDown(87)) {
      movingForward = true;
    }
    // S
    if (InputManager.isKeyDown(83)) {
      movingBackward = true;
    }
    // A
    if (InputManager.isKeyDown(65)) {
      movingLeft = true;
    }
    // D
    if (InputManager.isKeyDown(68)) {
      movingRight = true;
    }
    // Q
    if (InputManager.isKeyDown(81)) {
      turningLeft = true;
    }
    // E
    if (InputManager.isKeyDown(69)) {
      turningRight = true;
    }

    let velocity = new Vector2();
    if (movingForward) {
      velocity.x = -Math.sin(this._angle);
      velocity.y = -Math.cos(this._angle);
    } else if (movingBackward) {
      velocity.x = Math.sin(this._angle);
      velocity.y = Math.cos(this._angle);
    }

    if (movingLeft) {
      velocity.x += Math.sin(this._angle - TMath.degToRad(90));
      velocity.y += Math.cos(this._angle - TMath.degToRad(90));
    } else if (movingRight) {
      velocity.x += Math.sin(this._angle + TMath.degToRad(90));
      velocity.y += Math.cos(this._angle + TMath.degToRad(90));
    }

    velocity = velocity.normalize();
    velocity.x *= this._movementSpeed * dt;
    velocity.y *= this._movementSpeed * dt;

    this._camera.position.x += velocity.x;
    this._camera.position.z += velocity.y;

    if (turningLeft) this._angle += 1.5 * dt;
    else if (turningRight) this._angle -= 1.5 * dt;

    this._camera.rotation.y = this._angle;
  }

  // eslint-disable-next-line class-methods-use-this
  public onKeyDown(event: KeyboardEvent): void {
    // console.log(event.key);
  }

  // eslint-disable-next-line class-methods-use-this
  public onKeyUp(event: KeyboardEvent): void {
    // console.log(event);
  }

  public onMessage(message: Message): void {
    switch (message.code) {
      case InputEventMessage.KEY_DOWN:
        this.onKeyDown(message.context as KeyboardEvent);
        break;
      case InputEventMessage.KEY_UP:
        this.onKeyUp(message.context as KeyboardEvent);
        break;
      default:
        throw new Error('Received unexpected Message!');
    }
  }
}
