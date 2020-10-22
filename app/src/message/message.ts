import IMessageHandler from './iMessageHandler';
import IMessage from './iMessage';

class Message implements IMessage {
  private static _subscriptions: {
    [code: string]: IMessageHandler[];
  } = {};

  public code: string;
  public sender: unknown;
  public context: unknown;

  /**
   * Creates an instance of the Message object.
   *
   * @param {string} code Message code
   * @param {unknown} sender Sender of the message
   * @param {unknown} [context] Extra data to send with the message
   * @memberof Message
   */
  public constructor(code: string, sender: unknown, context?: unknown) {
    this.code = code;
    this.sender = sender;
    this.context = context;
  }

  /**
   * Attach a subscriber to listen to all Messages of a certain Message code
   *
   * @static
   * @param {string} code Message code
   * @param {IMessageHandler} handler Callback function to execute upon receiving a message
   * @memberof Message
   */
  public static subscribe(code: string, handler: IMessageHandler): void {
    if (!Message._subscriptions[code]) {
      Message._subscriptions[code] = [];
    }
    Message._subscriptions[code].push(handler);
  }

  /**
   * Remove a subscriber from a certain Message code
   *
   * @static
   * @param {string} code Message code
   * @param {IMessageHandler} handler Callback function to be unsubscribed
   * @memberof Message
   */
  public static unsubscribe(code: string, handler: IMessageHandler): void {
    if (!Message._subscriptions[code]) {
      console.warn(`Cannot unsubscribe from code ${code} as it is not currently registered`);
    } else {
      const index = Message._subscriptions[code].indexOf(handler);
      if (index !== -1) {
        Message._subscriptions[code].splice(index, 1);
        if (Message._subscriptions[code].length === 0) {
          delete Message._subscriptions[code];
        }
      }
    }
  }

  /**
   * Sends the message, by executing all the subscribed callback functions
   *
   * @static
   * @param {string} code Message code
   * @param {unknown} sender Sender of the message
   * @param {unknown} [context] Extra data to send with the message
   * @memberof Message
   */
  public static send(code: string, sender: unknown, context?: unknown): void {
    if (Message._subscriptions[code]) {
      const message = new Message(code, sender, context);
      Message._subscriptions[code].forEach(handler => handler.onMessage(message));
    }
  }
}

export default Message;
