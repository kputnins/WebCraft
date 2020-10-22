import { v4 as uuid } from 'uuid';
import DataStore from '../core/dataStore';

class Entity {
  private _id: string;

  constructor() {
    this._id = uuid();
    DataStore.setEntity(this._id, this);
  }

  public get id(): string {
    return this._id;
  }
}

export default Entity;
