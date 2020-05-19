import Message from '../message/message';
import InputEventMessage from '../constants/inputEventMessage';

class InputManager {
  private static _keys: boolean[] = [];
  private static _screen: HTMLCanvasElement;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Initializes the InputManager - Sets key states and adds event listeners
   *
   * @static
   * @param {HTMLCanvasElement} viewport Viewport element where the engine renders the screen
   * @memberof InputManager
   */
  public static init(screen: HTMLCanvasElement): void {
    InputManager._screen = screen;

    // Set all key states to not-pressed
    for (let i = 0; i < 256; i += 1) {
      InputManager._keys[i] = false;
    }

    window.addEventListener('keydown', InputManager.onKeyDown);
    window.addEventListener('keyup', InputManager.onKeyUp);
  }

  /**
   * Check to see weather a key is pressed
   *
   * @static
   * @param {number} keyCode Keycode of a keyboard key
   * @returns {boolean}
   * @memberof InputManager
   */
  public static isKeyDown(keyCode: number): boolean {
    return InputManager._keys[keyCode] === true;
  }

  /**
   * Check to see weather a key is not pressed
   *
   * @static
   * @param {number} keyCode Keycode of a keyboard key
   * @returns {boolean}
   * @memberof InputManager
   */
  public static isKeyUp(keyCode: number): boolean {
    return InputManager._keys[keyCode] === false;
  }

  /**
   * Record a pressed key and send a KEY_DOWN message on a key press event
   *
   * @private
   * @static
   * @param {KeyboardEvent} event Keyboard event triggered by a key press
   * @memberof InputManager
   */
  private static onKeyDown(event: KeyboardEvent): void {
    InputManager._keys[event.keyCode] = true;
    Message.send(InputEventMessage.KEY_DOWN, null, event);
  }

  /**
   * Records a released key and send a KEY_UP message on a key release event
   *
   * @private
   * @static
   * @param {KeyboardEvent} event Keyboard event triggered by a key release
   * @memberof InputManager
   */
  private static onKeyUp(event: KeyboardEvent): void {
    InputManager._keys[event.keyCode] = false;
    Message.send(InputEventMessage.KEY_UP, null, event);
  }
}

export default InputManager;
