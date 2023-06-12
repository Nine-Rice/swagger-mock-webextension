import { StorageLocal } from "@src/storage/helper";

const useStorageMutation = <Value>(storageLocal: StorageLocal<Value>) => {
  const [isLoading, setLoading] = React.useState(true);
  const storeData = useSnapshot(store);
  const key = storageLocal.key;

  const reloadAsync = React.useCallback(async () => {
    setLoading(true);
    const value = await storageLocal.get();
    store[key] = value;
    setLoading(false);
  }, [key, storageLocal]);

  const setAsync = async (val: Value) => {
    setLoading(true);
    await storageLocal.set(val);
    await reloadAsync();
  };

  const removeAsync = async () => {
    setLoading(true);
    await storageLocal.remove();
    await reloadAsync();
  };

  React.useEffect(() => {
    reloadAsync();
  }, []);

  return {
    data: _.cloneDeep(storeData[key]) as Value,
    isLoading,
    setAsync,
    removeAsync,
    reloadAsync,
  };
};

export default useStorageMutation;
