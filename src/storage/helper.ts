const storage = browser.storage;

export class StorageLocal<Value> {
  constructor(public key: string = "", public defaultValue?: Value) {}

  set = (value: Value) => {
    return storage.local.set({
      [this.key]: value,
    });
  };

  remove = () => {
    return storage.local.remove(this.key);
  };

  get = async () => {
    return (
      ((await storage.local.get(this.key))[this.key] as Value) ??
      this.defaultValue
    );
  };
}

const createStorageLocal = <T extends Record<string, any>>(dataMap: T) => {
  const storageLocal: any = {};
  for (const key in dataMap) {
    storageLocal[key] = new StorageLocal(key, dataMap[key]);
  }

  return storageLocal as {
    [key in keyof T]: StorageLocal<T[key]>;
  };
};

export default createStorageLocal;
