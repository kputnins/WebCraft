import IMessage from './iMessage';

export default interface IMessageHandler {
  onMessage(message: IMessage): void;
}
