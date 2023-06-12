import { StorageLocal } from "@src/storage/helper";
import { getUniqueId } from "@src/pages/options/utils";

type Item = {
  id: string;
  [key: string]: any;
};

const useArrayStorageMutation = <ItemValue extends Item>(
  storageLocal: StorageLocal<ItemValue[]>
) => {
  const {
    data = [],
    isLoading,
    setAsync,
  } = useStorageMutation<ItemValue[]>(storageLocal);
  const storeData = useSnapshot(store);
  const key = storageLocal.key;

  const addAsync = async (newItem: Omit<ItemValue, "id">) => {
    const id = getUniqueId("ARRAY_STORAGE_DATA");
    await setAsync([
      ...data,
      {
        ...newItem,
        id,
      } as ItemValue,
    ]);
  };

  const updateAsync = async (item: Item & Partial<ItemValue>) => {
    await setAsync(
      data.map((i) => {
        if (i.id === item.id) {
          return {
            ...i,
            ...item,
          };
        }
        return i;
      })
    );
  };

  const deleteAsync = async (id: string) => {
    await setAsync(data.filter((i) => i.id !== id));
  };

  const getItem = (id: string) => {
    return data.find((i) => i.id === id);
  };

  return {
    data: _.cloneDeep(storeData[key]) as ItemValue[],
    isLoading,
    addAsync,
    updateAsync,
    deleteAsync,
    getItem,
  };
};

export default useArrayStorageMutation;
