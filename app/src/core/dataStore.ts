/**
 * Creates a global data store object accepting any values
 *
 * @class DataManager
 */
class DataStore {
  private static _data: { [name: string]: unknown } = { entities: new Map() };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Saves a value to the store
   *
   * @static
   * @template T
   * @param {string} name Name of the data object
   * @param {T} value Data object
   * @memberof DataStore
   */
  public static setValue<T>(name: string, value: T): void {
    DataStore._data[name] = value;
  }

  /**
   * Retrieves a value from the store
   *
   * @static
   * @template T
   * @param {string} name Name of the data object
   * @returns {T}
   * @memberof DataStore
   */
  public static getValue<T>(name: string): T {
    return DataStore._data[name] as T;
  }

  /**
   * Saves an entity to the store
   *
   * @static
   * @template T
   * @param {string} name Name of the data object
   * @param {T} value Data object
   * @memberof DataStore
   */
  public static setEntity<T>(name: string, value: T): void {
    DataStore.getValue<Map<string, T>>('entities').set(name, value);
  }

  /**
   * Retrieves an entity from the store
   *
   * @static
   * @template T
   * @param {string} name Name of the data object
   * @returns {T}
   * @memberof DataStore
   */
  public static getEntity<T>(name: string): T {
    return DataStore.getValue<Map<string, T>>('entities').get(name) as T;
  }

  /**
   * Clears an entity from the store
   *
   * @static
   * @template T
   * @param {string} name Name of the data object
   * @memberof DataStore
   */
  public static removeEntity<T>(name: string): void {
    DataStore.getValue<Map<string, T>>('entities').delete(name);
  }
}

export default DataStore;
