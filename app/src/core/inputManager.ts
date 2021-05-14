/* eslint-disable @typescript-eslint/unbound-method */
import Message from '../message/message';
import InputEventMessage from '../constants/inputEventMessage';

class InputManager {
  private static _keys: boolean[] = [];
  private static _screen: HTMLCanvasElement;
  private static _pointerLocked: boolean;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static init(screen: HTMLCanvasElement): void {
    InputManager._screen = screen;

    // Set all key states to not-pressed
    for (let i = 0; i < 256; i += 1) {
      InputManager._keys[i] = false;
    }

    InputManager._screen.onclick = (): void => {
      InputManager._screen.requestPointerLock();
    };

    window.addEventListener('keydown', InputManager.onKeyDown);
    window.addEventListener('keyup', InputManager.onKeyUp);
    document.addEventListener('pointerlockchange', InputManager.onPointerLock);
  }

  private static onPointerLock(): void {
    if (document.pointerLockElement === InputManager._screen) {
      if (!this._pointerLocked) {
        document.addEventListener('mousemove', InputManager.onMouseMove);
        document.addEventListener('click', InputManager.onMouseClick);
        this._pointerLocked = true;
      }
    } else {
      document.removeEventListener('mousemove', InputManager.onMouseMove);
      document.removeEventListener('click', InputManager.onMouseClick);
      this._pointerLocked = false;
    }
  }

  private static onMouseMove(event: MouseEvent): void {
    Message.send(InputEventMessage.MOUSE_MOVE, null, event);
  }

  private static onMouseClick(event: MouseEvent): void {
    Message.send(InputEventMessage.MOUSE_CLICK, null, event);
  }

  public static isKeyDown(keyCode: number): boolean {
    return InputManager._keys[keyCode] === true;
  }

  public static isKeyUp(keyCode: number): boolean {
    return InputManager._keys[keyCode] === false;
  }

  private static onKeyDown(event: KeyboardEvent): void {
    InputManager._keys[event.keyCode] = true;
    Message.send(InputEventMessage.KEY_DOWN, null, event);
  }

  private static onKeyUp(event: KeyboardEvent): void {
    InputManager._keys[event.keyCode] = false;
    Message.send(InputEventMessage.KEY_UP, null, event);
  }
}

export default InputManager;
