import Message from '../message/message';
import InputEventMessage from '../constants/inputEventMessage';

class InputManager {
  private static _keys: boolean[] = [];
  private static _screen: HTMLCanvasElement;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static init(screen: HTMLCanvasElement): void {
    InputManager._screen = screen;

    // Set all key states to not-pressed
    for (let i = 0; i < 256; i += 1) {
      InputManager._keys[i] = false;
    }

    window.addEventListener('keydown', InputManager.onKeyDown);
    window.addEventListener('keyup', InputManager.onKeyUp);
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
