import { PerspectiveCamera, Camera, Vector3 } from 'three';
import IMessageHandler from './message/iMessageHandler';
import Message from './message/message';
import InputEventMessage from './constants/inputEventMessage';
import InputManager from './core/inputManager';
import TMath from './utils/tMaths';
import Level from './level/level';
import { MOVEMENT_SPEED, LOOK_SPEED } from './constants/options';

export default class Game implements IMessageHandler {
  private _camera!: PerspectiveCamera;
  private _level!: Level;
  private _targetPosition = new Vector3();
  private _angleX = 0;
  private _angleY = 0;
  private _movementSpeed = MOVEMENT_SPEED;
  private _lookSpeed = LOOK_SPEED;
  private _removeMode = false;

  public get activeCamera(): Camera {
    return this._camera;
  }

  public get activeLevel(): Level {
    return this._level;
  }

  public onStartup(aspect: number): void {
    this._camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
    this._camera.position.set(0, 0, -5);

    Message.subscribe(InputEventMessage.KEY_DOWN, this);
    Message.subscribe(InputEventMessage.KEY_UP, this);
    Message.subscribe(InputEventMessage.MOUSE_MOVE, this);
    Message.subscribe(InputEventMessage.MOUSE_CLICK, this);

    this.startNew();
  }

  private startNew(): void {
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
    let movingUp = false;
    let movingDown = false;

    // W and S
    if (InputManager.isKeyDown(87)) movingForward = true;
    else if (InputManager.isKeyDown(83)) movingBackward = true;

    // A and D
    if (InputManager.isKeyDown(65)) movingLeft = true;
    else if (InputManager.isKeyDown(68)) movingRight = true;

    // SPACE and SHIFT
    if (InputManager.isKeyDown(32)) movingUp = true;
    else if (InputManager.isKeyDown(16)) movingDown = true;

    let velocity = new Vector3();

    if (movingForward) {
      velocity.x = 0;
      velocity.y = -1;
    } else if (movingBackward) {
      velocity.x = 0;
      velocity.y = 1;
    }

    if (movingLeft) {
      velocity.x += -1;
      velocity.y += 0;
    } else if (movingRight) {
      velocity.x += 1;
      velocity.y += 0;
    }

    if (movingUp) {
      velocity.z += Math.cos(TMath.degToRad(this._angleY));
      velocity.y += -Math.sin(TMath.degToRad(this._angleY));
    } else if (movingDown) {
      velocity.z += -Math.cos(TMath.degToRad(this._angleY));
      velocity.y += Math.sin(TMath.degToRad(this._angleY));
    }

    velocity = velocity.normalize();
    velocity.x *= this._movementSpeed * dt;
    velocity.y *= this._movementSpeed * dt;
    velocity.z *= this._movementSpeed * dt;

    this._camera.translateX(velocity.x);
    this._camera.translateZ(velocity.y);
    this._camera.translateY(velocity.z);

    const phi = TMath.degToRad(90 - this._angleY);
    const theta = TMath.degToRad(this._angleX);

    this._targetPosition.setFromSphericalCoords(1, phi, theta).add(this._camera.position);

    this._camera.lookAt(this._targetPosition);
  }

  // eslint-disable-next-line
  private onKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === 81) {
      this._removeMode = !this._removeMode;
      const mode = this._removeMode ? 'REMOVE' : 'ADD';
      console.log(`=== ${mode} block mode ===`);
    }
  }

  // eslint-disable-next-line
  private onKeyUp(event: KeyboardEvent): void {
    console.debug(event);
  }

  private onMouseMove(event: MouseEvent): void {
    this._angleX -= event.movementX * this._lookSpeed;
    this._angleY -= event.movementY * this._lookSpeed;
    this._angleY = TMath.clamp(this._angleY, -85, 85);
  }

  private onMouseClick(event: MouseEvent): void {
    if (event.button === 0) this._level.placeVoxel(this._camera, this._removeMode);
  }

  public onMessage(message: Message): void {
    switch (message.code) {
      case InputEventMessage.KEY_DOWN:
        this.onKeyDown(message.context as KeyboardEvent);
        break;
      case InputEventMessage.KEY_UP:
        this.onKeyUp(message.context as KeyboardEvent);
        break;
      case InputEventMessage.MOUSE_MOVE:
        this.onMouseMove(message.context as MouseEvent);
        break;
      case InputEventMessage.MOUSE_CLICK:
        this.onMouseClick(message.context as MouseEvent);
        break;
      default:
        throw new Error('Received unexpected Message!');
    }
  }
}
