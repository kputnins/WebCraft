/**
 * Creates a global data store object accepting any values
 *
 * @class DataManager
 */
class DataStore {
  private static _data: { [name: string]: unknown } = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Sets a value o the store
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
   * Gets a value from the store
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
}

export default DataStore;
